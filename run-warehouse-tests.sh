#!/bin/bash
cd /Users/administrator/Documents/MES--System/源码/iMES.Net

echo "=== 构建测试容器 ==="
docker build -t imes-warehouse-tests:local -f iMES.Warehouse.Tests/Dockerfile .

echo ""
echo "=== 运行测试 ==="
docker run --rm imes-warehouse-tests:local dotnet test "/src/iMES.Warehouse.Tests/iMES.Warehouse.Tests.csproj" --no-restore --logger "console;verbosity=normal"

echo ""
echo "=== 测试完成 ==="