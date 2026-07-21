using System;
using System.Collections.Generic;
using iMES.Core.Utilities;
using iMES.Entity.DomainModels;
using Xunit;

namespace iMES.Custom.Tests
{
    public class ProcessLineRuleTests
    {
        [Fact]
        public void ProcessDetail_MissingProcessId_IsRejected()
        {
            var callback = PrepareUpdate();
            var result = callback(
                new Base_ProcessLine { ProcessLine_Id = 10 },
                new List<Base_ProcessLineList>
                {
                    new Base_ProcessLineList { ProcessLineType = "process", Process_Id = null },
                },
                new List<Base_ProcessLineList>(),
                new List<object>());

            Assert.False(result.Status);
            Assert.Equal("类型选择【工序】，则必输后面【工序】列", result.Message);
        }

        [Fact]
        public void ChildLineDetail_MissingChildLineId_IsRejected()
        {
            var callback = PrepareUpdate();
            var result = callback(
                new Base_ProcessLine { ProcessLine_Id = 10 },
                new List<Base_ProcessLineList>
                {
                    new Base_ProcessLineList { ProcessLineType = "processLine", ProcessLineDown_Id = null },
                },
                new List<Base_ProcessLineList>(),
                new List<object>());

            Assert.False(result.Status);
            Assert.Equal("类型选择【工艺路线】，则必输后面【工艺路线】列", result.Message);
        }

        [Fact]
        public void ChildLineDetail_SelfReference_IsRejected()
        {
            var callback = PrepareUpdate();
            var result = callback(
                new Base_ProcessLine { ProcessLine_Id = 10 },
                new List<Base_ProcessLineList>
                {
                    new Base_ProcessLineList { ProcessLineType = "processLine", ProcessLineDown_Id = 10 },
                },
                new List<Base_ProcessLineList>(),
                new List<object>());

            Assert.False(result.Status);
            Assert.Equal("子工艺路线不能添加当前工艺路线", result.Message);
        }

        [Fact]
        public void ValidProcessAndChildLineDetails_AreAccepted()
        {
            var callback = PrepareUpdate();
            var result = callback(
                new Base_ProcessLine { ProcessLine_Id = 10 },
                new List<Base_ProcessLineList>
                {
                    new Base_ProcessLineList { ProcessLineType = "process", Process_Id = 20 },
                },
                new List<Base_ProcessLineList>
                {
                    new Base_ProcessLineList { ProcessLineType = "processLine", ProcessLineDown_Id = 30 },
                },
                new List<object>());

            Assert.True(result.Status);
        }

        private static Func<Base_ProcessLine, object, object, List<object>, WebResponseContent> PrepareUpdate()
        {
            var service = ServiceFactory.ProcessLine();
            service.Update(null);
            return TestProxy.Callback<Func<Base_ProcessLine, object, object, List<object>, WebResponseContent>>(
                service,
                "UpdateOnExecuting");
        }
    }
}
