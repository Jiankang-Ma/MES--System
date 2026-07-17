# iMES Mac M2 本地开发部署说明

## 当前结论

本地开发已验证通过：

- SQL Server：Docker Desktop x64 仿真容器，端口 `1433`
- Redis：Docker 容器，端口 `6379`
- 后端 API：Docker 容器，端口 `9991`
- 前端：Mac 本机 Vue dev server，端口 `9990`

这个方案用于本机跑源码、查 bug、加功能。不是生产等价部署。Mac M2 上 SQL Server 依赖 x64 仿真，速度和稳定性不如真正的 x64 Linux/Windows 服务器。

## 相关文件

- `docker-compose.yml`
- `.env`
- `.env.example`
- `源码/iMES.Net/iMES.WebApi/Dockerfile`
- `源码/iMES.Vue3/Dockerfile`
- `源码/iMES.Vue3/nginx.conf`
- `数据库/DB/iMES-SQLServer2016/iMES20221014/docker-import/iMES20221014.docker.sql`

## 1. Docker Desktop 设置

Mac M2 上跑 SQL Server 容器前，Docker Desktop 需要开启 Apple Silicon 的 x86/amd64 仿真能力：

```text
Docker Desktop -> Settings -> General
```

开启类似下面的选项：

```text
Use Rosetta for x86/amd64 emulation on Apple Silicon
```

然后重启 Docker Desktop。

## 2. 环境变量

第一次部署时复制模板：

```bash
cp .env.example .env
```

当前本机 `.env` 里使用这些变量：

```env
MSSQL_HOST=host.docker.internal
MSSQL_PORT=1433
MSSQL_SA_PASSWORD=xxxx
REDIS_PASSWORD=xxxx
```

`MSSQL_SA_PASSWORD` 是 Docker 创建 SQL Server 容器时设置的 `sa` 密码，不是 Mac 系统密码。

## 3. 启动 SQL Server 和 Redis

在项目根目录执行：

```bash
cd /Users/yuanzhuoshen/Desktop/MES系统源码Docker部署
docker compose --profile x64-sqlserver up -d sqlserver-x64 redis
```

查看状态：

```bash
docker compose --profile x64-sqlserver ps
```

SQL Server 日志里出现可连接提示后再导入数据库：

```bash
docker compose logs -f sqlserver-x64
```

## 4. 导入数据库

已生成 Docker/Linux SQL Server 专用脚本：

```text
数据库/DB/iMES-SQLServer2016/iMES20221014/docker-import/iMES20221014.docker.sql
```

这个脚本相对原始脚本只改了 MDF/LDF 路径：

```text
/var/opt/mssql/data/iMES.mdf
/var/opt/mssql/data/iMES_log.ldf
```

用 VS Code 的 `SQL Server (MSSQL)` 扩展连接：

```text
Server: localhost,1433
Database: master
Authentication: SQL Login
User: sa
Password: .env 里的 MSSQL_SA_PASSWORD
Trust Server Certificate: true
```

打开并执行：

```text
数据库/DB/iMES-SQLServer2016/iMES20221014/docker-import/iMES20221014.docker.sql
```

执行完成后验证：

```sql
SELECT name FROM sys.databases WHERE name = 'iMES';
```

返回 `iMES` 即导入成功。


不要执行原始脚本：

```text
数据库/DB/iMES-SQLServer2016/iMES20221014/iMES20221014.sql
```

原始脚本仍是 Windows SQL Server 路径，保留用于 Windows 环境。

## 5. 启动后端 API

```bash
cd /Users/yuanzhuoshen/Desktop/MES系统源码Docker部署
docker compose up -d --build api
```

后端地址：

```text
http://localhost:9991
```

查看日志：

```bash
docker compose logs -f api
```

说明：后端 Dockerfile 已处理 `.NET Core 3.1` 基础镜像的 Debian buster apt 源归档问题。这个改动应保留，本地和云端构建都需要。

## 6. 启动前端开发服务器

当前 Mac 本机 Node 是较新的版本，老 Vue CLI/webpack 需要 OpenSSL 兼容参数：

```bash
cd /Users/yuanzhuoshen/Desktop/MES系统源码Docker部署/源码/iMES.Vue3
NODE_OPTIONS=--openssl-legacy-provider npm run serve
```

前端地址：

```text
http://localhost:9990
```

默认登录：

```text
admin / 123456
```

如果 macOS 弹出 `fsevents.node Not Opened`：

1. 不要点 `Move to Trash`。
2. 点 `Done`。
3. 打开 `System Settings -> Privacy & Security`。
4. 对 `fsevents.node` 点 `Allow Anyway` 或 `Open Anyway`。
5. 重新执行前端启动命令。

## 7. 日常启动命令

完整启动：

```bash
cd /Users/yuanzhuoshen/Desktop/MES系统源码Docker部署
docker compose --profile x64-sqlserver up -d sqlserver-x64 redis
docker compose up -d --build api

cd 源码/iMES.Vue3
NODE_OPTIONS=--openssl-legacy-provider npm run serve
```

如果没有改后端代码，可以不加 `--build`：

```bash
docker compose up -d api
```

如果只改前端代码，保持 `npm run serve` 运行即可，通常会热更新。

## 8. 停止服务

停止前端：

```text
在前端 npm run serve 的终端按 Ctrl+C
```

停止 Docker 服务并保留数据库数据：

```bash
cd /Users/yuanzhuoshen/Desktop/MES系统源码Docker部署
docker compose --profile x64-sqlserver down
```

不要执行：

```bash
docker compose down -v
```

`-v` 会删除 volume，可能清掉 SQL Server/Redis 数据。

## 9. 端口

```text
前端：http://localhost:9990
后端：http://localhost:9991
SQL Server：localhost,1433
Redis：localhost:6379
```

## 10. 云部署说明

云服务器建议使用 x64 Linux 或 Windows Server。不要使用 Apple Silicon 专用的 `sqlserver-x64` profile 思路。

推荐云端结构：

```text
web 容器 + api 容器 + redis 容器 + 独立 SQL Server
```

前端云部署可以使用 `源码/iMES.Vue3/Dockerfile`，该 Dockerfile 使用 Node 14 构建，不需要本机开发用的：

```bash
NODE_OPTIONS=--openssl-legacy-provider
```

后端 Dockerfile 里的 Debian archive 源修复需要保留。

## 11. 常用排查

查看 Docker 服务：

```bash
docker compose --profile x64-sqlserver ps
```

查看后端日志：

```bash
docker compose logs -f api
```

查看 Redis 日志：

```bash
docker compose logs -f redis
```

查看 SQL Server 日志：

```bash
docker compose logs -f sqlserver-x64
```

登录页一直转圈或网络异常，优先检查：

1. `iMES` 数据库是否存在。
2. `.env` 中 SQL Server 密码是否正确。
3. API 容器是否在运行。
4. API 日志是否有数据库或 Redis 连接错误。
5. 前端是否访问 `http://localhost:9990`，后端是否允许该端口跨域。
