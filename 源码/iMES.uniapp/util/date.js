export function formateDate(unixtime) {
	var d = new Date(parseInt(unixtime)); // 依情况进行更改 * 1
	return (d.getFullYear()) + '-' + (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) + '-' + (d
		.getDate() > 9 ? d.getDate() : '0' + d.getDate());
}
