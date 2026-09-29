# Renewing the Contentful management token

The admin dashboard at `/admin` talks to Contentful with a **management token**.
Contentful refuses to issue one that never expires — five years is the longest it
allows — so this has to be redone once every five years.

**Current token:** `gesa-website`, expires **28 September 2031**.

## What breaks when it expires

Only the dashboard. `gesaknust.com` itself keeps working normally, because the
public pages read through a separate delivery token that does not expire. The
symptom is `/admin` failing to load or refusing to save.

The dashboard warns you inside the last 60 days, so you should never be surprised
by it.

## How to renew it

1. Log in at **app.contentful.com** and open the GESA space.
2. Gear icon (top right) → **API keys** → **Content management tokens** tab.
3. **Create personal access token.** Name it `gesa-website-<year>` and choose the
   longest expiry offered.
4. Copy the value immediately. Contentful shows it once and never again.
5. **Vercel → project → Settings → Environment Variables.** Edit
   `CONTENTFUL_MANAGEMENT_TOKEN`, paste the new value, save. Tick Production,
   Preview and Development.
6. **Vercel → Deployments → the latest one → Redeploy.** Environment variables
   only take effect on a new deployment.
7. Open `https://www.gesaknust.com/admin`, change something small and save it.
   If that works, the renewal is done.
8. Revoke the old token on the same Contentful page. Do this *after* step 7, not
   before.

## Things that have caught people out

- **The token belongs to the person who created it.** If that account is later
  removed from the Contentful space, the token stops working even though it has
  not expired. Create it under an account GESA will keep — ideally a shared
  association login, not a graduating student's personal one.
- **Editing the value in Vercel is not enough on its own.** Without a redeploy the
  old value stays live.
- **Do not revoke the old token first.** If the new one turns out to be wrong you
  would have locked yourself out of the dashboard entirely.
- **Never commit the token.** It lives in `.env.local` (git-ignored) and in
  Vercel's environment variables. Nowhere else.
