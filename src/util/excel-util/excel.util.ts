import * as XLSX from 'xlsx';

export class ExcelUtil {
  parseExcelFirstSheet(spreadSheet: Buffer) {
    const workbook = XLSX.read(spreadSheet.buffer, {
      type: 'buffer',
      raw: true,
      cellDates: true,
    });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json<any[]>(worksheet, {
      header: 1,
      skipHidden: false,
      defval: '',
    });
  }
}
