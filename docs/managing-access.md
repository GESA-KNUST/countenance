# Who can change the website

People sign in to `/admin` with **Google**. There is no shared password to pass around,
and access can be taken back at any time.

## Two kinds of access

- **Can change the website** — edit events, blog posts, executives, photos, everything.
- **Can also invite and remove people** — the above, plus the *Website managers* page.

## Inviting someone

1. Open `/admin` and go to **Website managers** under *Access*.
2. Enter their name and the **Gmail address they will sign in with**, and choose what they
   can do.
3. Press **Create invite link** and send them the link that appears (WhatsApp is fine).

The link works **once**, only for that email address, and stops working after **7 days**.
If someone forwards it, the other person cannot use it — they will be told the invite was
sent to a different address.

## Removing someone

On the same page, press **Remove** next to their name. They lose access within a minute,
even if they are signed in at that moment. Their name moves to *Removed*; invite them again
to give access back.

Two things are refused on purpose: you cannot remove your own access, and the last remaining
owner cannot be removed. That is what stops the site being locked away from everyone.

## The Heads password

`ADMIN_PASSWORD` still signs you in as owner, through **Heads sign in** at the bottom of the
login screen. It exists so a Google outage or a locked account can never lock you out of your
own website.

Do not give it to managers — they do not need it, and it cannot be revoked from the
dashboard. Changing it in Vercel is the only way to close it.

## If someone cannot get in

- *"That Google account does not have access"* — they signed in with a different Gmail from
  the one invited. Invite the address they actually use.
- *"That invite was sent to a different email address"* — the link was forwarded.
- *"This invite has expired"* — past 7 days, or already used. Send a new one.

## For developers

- Records live in the unpublished `siteManager` content type, so emails and invite tokens are
  never exposed by the public Delivery API. Only a SHA-256 hash of each invite token is stored.
- Sessions are signed with a key derived from `ADMIN_SESSION_SECRET`. Changing that value
  signs everybody out immediately.
- `ADMIN_OWNER_EMAIL` names the account the Heads password signs in as.
- Google callback URLs must be registered in Google Cloud for both
  `/api/admin/auth/callback` and `/api/contribute/auth/callback`.
