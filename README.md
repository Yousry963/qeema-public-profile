# Qeema public employee profile

## Demo

Open `index.html` to present the local demo. It uses Ahmed Yousry’s supplied photo and the work identity and professional details reviewed in Capella. The department is **Technology**. Both Capella phone numbers are tappable and included in the saved contact. Certificates and Key Projects reflect the empty sections in Capella. The page uses Material Design 3 with Qeema’s official wordmark and green palette. [Capella profile](https://hr.qeema.io/user-profile), [Material Design 3](https://m3.material.io/), [Qeema](https://www.qeema.net/)

To try the QR landing URL and **Copy profile link**, run this command from this folder and open the demo link on the same machine.

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

[Open the local demo](http://127.0.0.1:8765/?id=e82efd1a-167d-4ce8-ba89-0cd4e0a55d42)

## Host the page

1. Serve `index.html`, `styles.css`, `profile.js`, and `assets/` from Qeema’s existing web hosting. Use an HTTPS hostname owned by Qeema, such as `people.qeema.net`. With the existing Kubernetes setup, route `/` to a static web server and `/api/public-profiles/` to a small profile API. [Kubernetes Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)
2. Assign a permanent random `publicId` to each employee approved for publication. Keep its mapping to the Capella employee identifier in the profile API. Encode a URL like `https://people.qeema.net/?id=<publicId>` in the QR. The ID stays fixed when employee details change.
3. Replace the demo lookup in `profile.js` with `GET /api/public-profiles/{publicId}`. The profile API calls Capella with a narrowly scoped service credential held on the server. It returns the approved fields below. Once a profile is unpublished, both the profile and its photo should return `404`. Remove the local demo fixture and the supplied photo before deploying the production assets.

## Capella fields

The signed-in Capella profile shows the work identity in its shared header, both phone numbers in **Account Setting** and **Professional Profile**, and career details in **Professional Profile**. Keep HR identifiers and account settings internal. Include each phone only if it is a work number approved for public contact. Include professional sections when approved and populated. [Capella profile](https://hr.qeema.io/user-profile)

The existing Qeema Hub integration with `/api/account/user/v2` confirms `name`, `title`, and `email`. Verify the individual account and Professional Profile endpoints, including which response fields supply department, location, and each optional section, before implementing the production adapter.

| Public field | Capella source |
| --- | --- |
| `displayName` | `generalInformation.name` |
| `jobTitle` | `organizationInformation.title` |
| `workEmail` | `generalInformation.email` |
| Phone Number 1 and 2 | The local account DTO defines `contactInformation.phone1` and `contactInformation.phone2`. Verify the individual account response and map each approved work number separately. |
| `department` | Professional Profile → Department. Verify whether the individual account endpoint exposes this as `organizationInformation.businessUnit`. |
| `workLocation` | Professional Profile → Location (based on calendar). Verify whether `organizationInformation.defWorkingLocation` matches this value. |
| Professional Summary | Professional Profile → Professional Summary. |
| Experience, Technologies & Tools, Education, Certificates, Key Projects | The corresponding lists in Professional Profile. |
| `photoUrl` | Same-origin image URL served by the profile API. Ahmed’s Capella profile showed initials. Confirm Capella’s photo retrieval endpoint with a photo-enabled account. The local account DTO excludes `generalInformation.profilePicture` from JSON. Use initials when the photo is unavailable. |

## Keep it fast

- Keep the static page dependency-free. Compress HTML, CSS, and JavaScript and give versioned assets long cache lifetimes. Use one small profile JSON request per scan. [HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
- Serve a WebP portrait sized for the layout. Use the profile ID to key any shared cache. Start with uncached profile data and photos if unpublishing must take effect immediately. If latency warrants caching, agree on a short TTL and purge both paths on unpublish. [Image performance](https://web.dev/learn/performance/image-performance)
