import { writeFile } from 'node:fs/promises';

const spheres = [
  [500,440,126,'blue'],[660,406,122,'blue'],[823,407,150,'rose'],[1000,429,121,'blue'],[1123,463,136,'blue'],
  [352,566,143,'blue'],[542,554,147,'blue'],[756,550,151,'blue'],[962,567,161,'blue'],[1266,569,143,'blue'],
  [80,707,171,'blue'],[250,710,182,'rose'],[438,766,197,'blue'],[700,751,190,'blue'],[927,777,192,'rose'],[1150,760,187,'blue'],[1430,728,190,'rose'],[1634,745,186,'blue'],
  [120,994,225,'blue'],[404,1024,211,'blue'],[681,1083,220,'rose'],[950,1028,227,'blue'],[1224,1055,239,'blue'],[1520,1020,226,'blue']
];
const body = spheres.map(([x,y,r,color], index) => `<g filter="url(#texture)"><circle cx="${x+7}" cy="${y+14}" r="${r}" fill="#081b31" opacity=".25"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${color})"/><ellipse cx="${x-r*.33}" cy="${y-r*.47}" rx="${r*.5}" ry="${r*.2}" fill="#d7e9fa" opacity=".025" transform="rotate(-25 ${x} ${y})"/></g>`).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000"><defs><linearGradient id="sky" x2="1" y2=".7"><stop stop-color="#517d9f"/><stop offset=".55" stop-color="#82a4bf"/><stop offset="1" stop-color="#9caabd"/></linearGradient><radialGradient id="blue" cx="30%" cy="20%" r="80%"><stop stop-color="#c0d7eb"/><stop offset=".23" stop-color="#96b6d5"/><stop offset=".52" stop-color="#3b6d9b"/><stop offset=".82" stop-color="#153d67"/><stop offset="1" stop-color="#081e39"/></radialGradient><radialGradient id="rose" cx="32%" cy="18%" r="82%"><stop stop-color="#ead6e4"/><stop offset=".27" stop-color="#d9b2cd"/><stop offset=".55" stop-color="#af7d9e"/><stop offset=".83" stop-color="#623e6a"/><stop offset="1" stop-color="#211d3c"/></radialGradient><filter id="texture" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed="7" result="noise"/><feColorMatrix in="noise" type="saturate" values="0" result="grain"/><feComposite in="grain" in2="SourceGraphic" operator="in" result="clipped"/><feBlend in="SourceGraphic" in2="clipped" mode="soft-light"/></filter></defs><rect width="1600" height="1000" fill="url(#sky)"/>${body}</svg>`;
await writeFile(new URL('../assets/pebbles.svg', import.meta.url), svg);
console.log('Generated original pebble backdrop.');
