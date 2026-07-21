# iMES.Production.Tests

## 目标

为生产领域补齐一组可执行的单元测试，覆盖生产计划、报工规则等业务场景，并验证测试工程在当前环境下可稳定运行。

## 测试覆盖

- `Production_ProductPlanRepositoryTests`
  - 验证仓储层新增生产计划实体后，能够写入内存数据库并被成功读取。
- `ProductionWorkflowRulesTests`
  - 验证报工时间字段的移动端 Unix 毫秒值标准化。
  - 验证确认生效的报工在报工数量小于等于 0 时被拒绝。
  - 验证未确认状态下不进行数量校验。

## 执行结果

执行命令：

```powershell
Set-Location 'H:\mes\MES--System-remote\源码\iMES.Net'
dotnet test iMES.Production.Tests\iMES.Production.Tests.csproj --no-restore
```

结果：

- 失败: 0
- 通过: 5
- 已跳过: 0

基线提交：

- `dc05ce8c81bfdba0984b26bd22c55cef7d52d5d2`
