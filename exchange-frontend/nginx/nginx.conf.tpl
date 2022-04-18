server {
    listen       80;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;

        try_files $uri $uri/ /index.html?$args;
    }

    location /api {
        proxy_pass              ${API_URL};
        rewrite                 /api/(.*) /$1  break;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}