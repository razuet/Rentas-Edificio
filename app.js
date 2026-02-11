const grid=document.getElementById('grid');
const reportBox=document.getElementById('report');
const now=new Date();
const monthKey=now.getFullYear()+'-'+(now.getMonth()+1);
document.getElementById('monthLabel').textContent=monthKey;

const allData=JSON.parse(localStorage.getItem('rentMonthly'))||{};
if(!allData[monthKey]){
  allData[monthKey]=Array.from({length:16}).map(()=>({tenant:'',amount:'',due:'',status:'Pendiente',notes:''}));
}

let data=allData[monthKey];

function save(){
  allData[monthKey]=data;
  localStorage.setItem('rentMonthly',JSON.stringify(allData));
}

function render(){
  grid.innerHTML='';
  data.forEach((unit,i)=>{
    const card=document.createElement('div');
    card.className='card';
    const statusClass=unit.status==='Al día'?'al-dia':unit.status==='Pendiente'?'pendiente':'atrasado';
    card.innerHTML=`
      <h3>Depto ${i+1}</h3>
      <div class="status ${statusClass}">${unit.status}</div>
      <input placeholder="Inquilino" value="${unit.tenant}">
      <input type="number" placeholder="Monto" value="${unit.amount}">
      <input type="date" value="${unit.due}">
      <select>
        <option ${unit.status==='Al día'?'selected':''}>Al día</option>
        <option ${unit.status==='Pendiente'?'selected':''}>Pendiente</option>
        <option ${unit.status==='Atrasado'?'selected':''}>Atrasado</option>
      </select>
      <textarea placeholder="Observaciones">${unit.notes}</textarea>
    `;
    const inputs=card.querySelectorAll('input,textarea,select');
    inputs[0].oninput=e=>{data[i].tenant=e.target.value;save();};
    inputs[1].oninput=e=>{data[i].amount=e.target.value;save();};
    inputs[2].oninput=e=>{data[i].due=e.target.value;save();};
    inputs[3].onchange=e=>{data[i].status=e.target.value;save();render();};
    inputs[4].oninput=e=>{data[i].notes=e.target.value;save();};
    grid.appendChild(card);
  });
}

function generateReport(){
  let total=0,paid=0,pending=0,late=0;
  data.forEach(u=>{
    const amt=parseFloat(u.amount)||0;
    total+=amt;
    if(u.status==='Al día')paid+=amt;
    if(u.status==='Pendiente')pending+=amt;
    if(u.status==='Atrasado')late+=amt;
  });
  reportBox.innerHTML=`
    <h3>Reporte del mes ${monthKey}</h3>
    <p>Total esperado: $${total.toFixed(2)}</p>
    <p>Pagado: $${paid.toFixed(2)}</p>
    <p>Pendiente: $${pending.toFixed(2)}</p>
    <p>Atrasado: $${late.toFixed(2)}</p>
  `;
}

render();
