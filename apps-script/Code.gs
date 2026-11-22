/**
 * Clipping Book: form response reader.
 *
 * Attach this to the client Google Form (form editor → ⋮ → Apps Script),
 * paste the key from the app's Settings → Client form into SECRET below,
 * then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 *
 * Only requests that include the secret key get any data back.
 */
const SECRET = 'PASTE-YOUR-KEY-FROM-THE-APP-HERE';

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (!SECRET || SECRET.indexOf('PASTE-') === 0 || p.key !== SECRET) {
    return json_({ error: 'unauthorized' });
  }
  const form = FormApp.getActiveForm();
  const items = form.getItems()
    .filter(function (it) { return it.getType() !== FormApp.ItemType.SECTION_HEADER && it.getType() !== FormApp.ItemType.PAGE_BREAK && it.getType() !== FormApp.ItemType.IMAGE && it.getType() !== FormApp.ItemType.VIDEO; })
    .map(function (it) { return { id: String(it.getId()), title: it.getTitle(), type: String(it.getType()) }; });

  const responses = form.getResponses().map(function (r) {
    let email = '';
    try { email = r.getRespondentEmail() || ''; } catch (err) { /* not collected */ }
    return {
      id: r.getId(),
      at: r.getTimestamp().toISOString(),
      email: email,
      answers: r.getItemResponses().map(function (ir) {
        const a = ir.getResponse();
        return { id: String(ir.getItem().getId()), q: ir.getItem().getTitle(), a: Array.isArray(a) ? a.join(', ') : String(a) };
      })
    };
  });

  let prefill = '';
  if (p.nameItem) {
    try {
      const item = form.getItemById(Number(p.nameItem));
      const typed = item.getType() === FormApp.ItemType.PARAGRAPH_TEXT ? item.asParagraphTextItem() : item.asTextItem();
      prefill = form.createResponse().withItemResponse(typed.createResponse('__NAME__')).toPrefilledUrl();
    } catch (err) { /* question type can't be prefilled */ }
  }

  return json_({ title: form.getTitle(), link: form.getPublishedUrl(), items: items, responses: responses, prefill: prefill });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
