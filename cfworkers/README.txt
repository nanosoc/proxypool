1. 有自己的域名并使用cloudflare进行解析

2. 在cf添加一条DNS记录，ip随便写，要选中使用代理图标

3. 在cloudflare workers新增一个worker，将proxypool.js里面的内容复制进去，修改第一行代码中的域名为你刚刚解析的域名

4. 在域名Workers添加一条路由，将刚刚解析的域名路由到刚刚创建的worker，不要忘记后面的 /* ，具体看图

5. 申请域名获得许可，修改proxypool.js中第二行代码token为你的token
