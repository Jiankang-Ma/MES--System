using System.Linq;
using iMES.Entity.DomainModels;

namespace iMES.Core.Extensions
{
    /// <summary>
    /// SaveModel 明细变更判定。单表页面常会提交空数组，空数组不应进入主从表处理分支。
    /// </summary>
    public static class SaveModelExtensions
    {
        public static bool HasDetailChanges(this SaveModel saveModel)
        {
            if (saveModel == null) return false;
            return (saveModel.DetailData?.Any(item => item != null && item.Count > 0) ?? false)
                || (saveModel.DelKeys?.Count > 0);
        }
    }
}
