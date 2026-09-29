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

## The easy way (one command)

On a computer with the project checked out and a still-valid token in `.env.local`:

```bash
npm run token:renew
```

That creates a new five-year token, checks it works, writes it into `.env.local`
(keeping a `.env.local.backup`), and prints the value with the remaining steps.

Then, because the live site reads its own copy of the value:

1. **Vercel → project → Settings → Environment Variables.**
   Edit `CONTENTFUL_MANAGEMENT_TOKEN`, paste the new value, save.
   Make sure Production, Preview and Development are all ticked.
2. **Vercel → Deployments → the latest one → Redeploy.**
   Environment variables only take effect on a new deployment.
3. Open `https://www.gesaknust.com/admin`, change something small and save it.
   If that works, the renewal is done.
4. Revoke the old token: **app.contentful.com → Settings → API keys →
   Content management tokens.** Do this *after* step 3, not before.

## The manual way (no computer with the project on it)

1. Log in at **app.contentful.com** and open the GESA space.
2. Gear icon (top right) → **API keys** → **Content management tokens** tab.
3. **Create personal access token.** Name it `gesa-website-<year>` and choose the
   longest expiry offered.
4. Copy the value immediately. Contentful shows it once and never again.
5. Do steps 1–4 from the list above (Vercel, redeploy, test, revoke the old one).

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
