```bash

$ passport-google-oauth20           //google oauth2사용을 위해
$ @types/passport-google-oauth20    //google oauth2사용을 위해
```

"typeorm": "npm run build && npx typeorm -d ./dist/config/typeorm.config.js",
"typeorm2": "npm run build && npx typeorm",
"migration:create": "npm run typeorm2 -- migration:create",
"migration:generate": "npm run typeorm -- migration:generate",
"migration:run": "npm run typeorm -- migration:run",
"migration:revert": "npm run typeorm -- migration:revert"
