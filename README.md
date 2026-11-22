# Clipping Book

A booking app for a horse-clipping business. It handles upcoming clips, a calendar, travel fees, history, and a client list. It runs entirely in the browser. Data is encrypted with your password and stored on the device, so this repo and the website contain no client information.

Live at: https://rhyn0sc.github.io/clipping-book/

## Client form tracking (Google Forms)

The app can show which clients have returned the intake Google Form. It does this through a small Google Apps Script that only answers when given your secret key.

1. In the app, go to **Settings → Client form**, tap **Generate**, then **Copy script**. The script ([`apps-script/Code.gs`](apps-script/Code.gs)) is copied with your key already filled in.
2. Open the form in Google Forms, then go to **⋮ → Apps Script**. Replace the code with what you copied and click **Save**.
3. Click **Deploy → New deployment → Web app**. Set **Execute as: Me** and **Who has access: Anyone**, then click **Deploy** and authorize.
4. Paste the web app URL (ending in `/exec`) into the app and tap **Test connection**.
5. Pick which question asks for the client's name. Responses are matched to clients by that name, a horse name, or the client's email. Any the app can't match show up under **Clients → Form responses to match**.

If you change the key later, paste it into the script and publish a new version: **Deploy → Manage deployments → Edit → Version: New version**.
