using iMES.Core.Extensions;
using iMES.Core.Utilities;
using iMES.Custom.IRepositories;
using iMES.Entity.DomainModels;
using System;
using System.Linq;

namespace iMES.Warehouse.Services
{
    public static class WarehouseCodeGenerator
    {
        public static string GenerateBillCode(
            Func<string> queryLastCode,
            IBase_NumberRuleRepository numberRuleRepository,
            string formCode)
        {
            string lastCode = queryLastCode();
            Base_NumberRule numberRule = numberRuleRepository.FindAsIQueryable(x => x.FormCode == formCode)
                .OrderByDescending(x => x.CreateDate)
                .FirstOrDefault();
            if (numberRule != null)
            {
                string rule = numberRule.Prefix + DateTime.Now.ToString(numberRule.SubmitTime.Replace("hh", "HH"));
                if (string.IsNullOrEmpty(lastCode))
                {
                    rule += "1".PadLeft(numberRule.SerialNumber, '0');
                }
                else
                {
                    rule += (lastCode.Substring(lastCode.Length - numberRule.SerialNumber).GetInt() + 1).ToString("0".PadLeft(numberRule.SerialNumber, '0'));
                }
                return rule;
            }
            else
            {
                return DateTime.Now.ToString("yyyyMMddHHmmssffff");
            }
        }
    }
}
