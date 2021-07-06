export function dmyFormat(date: Date) {
  let display: string = '';

  if(date) {
    const d: string = (date.getDate() as unknown) as string;
    const y: string = (date.getFullYear() as unknown) as string;
    let m: string = '';

    switch(date.getMonth()) {
    case 0:
      m = 'January';
      break;
    case 1:
      m = 'February';
      break;
    case 2:
      m = 'March';
      break;
    case 3:
      m = 'April';
      break;
    case 4:
      m = 'May';
      break;
    case 5:
      m = 'June';
      break;
    case 6:
      m = 'July';
      break;
    case 7:
      m = 'August';
      break;
    case 8:
      m = 'September';
      break;
    case 9:
      m = 'October';
      break;
    case 10:
      m = 'November';
      break;
    case 11:
      m = 'December';
    } 

    display = display + `${m} ${d}, ${y}`

  }

  return display;

} 
