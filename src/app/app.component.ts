import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableModule } from 'primeng/table';
import { IEmployee } from './core/models/Interfaces/IEmployee';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from './core/models/Classes/Employee';
import {  Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,TableModule,CommonModule,ReactiveFormsModule,NgxChartsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
// Initialize
  myForm:FormGroup=new FormGroup({});
// Employee List and Object
  EmployeeList:IEmployee[]=[];
  EmpObj:Employee=new Employee();

  // chart data Array
  chartData:{name:string,value:number}[]=[];
  // usi predefined color scheme
 colorScheme='cool';
//  using a custom color scheme
colorScheme1:Color={
name:'custom',
selectable:true,
group:ScaleType.Ordinal,
domain:['#5AA454','#A10A28','#C7B42C','#AAAAAA']
};

view: [number, number] = [700, 200];

  constructor(private fb:FormBuilder){
  }

  ngOnInit(): void {

    this.createForm()

    const oldData=localStorage.getItem("EmpData");
    if(oldData!=null){
      const parseData=JSON.parse(oldData);
      this.EmployeeList=parseData; 
      // initialize chart data  
      this.updateChartData(); 
    }
   
  }

  createForm(){
    this.myForm=new FormGroup({
      empid:new FormControl(this.EmpObj.empid),
      ename:new FormControl(this.EmpObj.ename,(Validators.required)),
      emailid:new FormControl(this.EmpObj.emailid,(Validators.required,Validators.email)),
      contactno:new FormControl(this.EmpObj.contactno,(Validators.required,Validators.maxLength(10))),
      address:new FormControl(this.EmpObj.address,(Validators.required)),
      city:new FormControl(this.EmpObj.city,(Validators.required)),
      state:new FormControl(this.EmpObj.state,(Validators.required)),
    })
  }

  onSave(){
const oldData=localStorage.getItem("EmpData");
if(oldData!=null){
  const parseData=JSON.parse(oldData);
  this.myForm.controls['empid'].setValue(parseData.length +1);
 this.EmployeeList.unshift(this.myForm.value);
}
else{
  this.EmployeeList.unshift(this.myForm.value);
}
localStorage.setItem("EmpData",JSON.stringify(this.EmployeeList));
// update chart after save
this.updateChartData();
this.onReset();
  }
 
onReset(){
  this.EmpObj=new Employee();
  this.createForm();
}

onEdit(item:Employee){
this.EmpObj=item;
this.createForm();
}

onUpdate(){
  const record=this.EmployeeList.find(m=>m.empid==this.myForm.controls['empid'].value);
  if(record!=undefined){
    record.ename=this.myForm.controls['ename'].value;
    record.emailid=this.myForm.controls['emailid'].value;
    record.contactno=this.myForm.controls['contactno'].value;
    record.city=this.myForm.controls['city'].value;
    record.state=this.myForm.controls['state'].value;
    record.address=this.myForm.controls['address'].value;
  }
  localStorage.setItem("EmpData",JSON.stringify(this.EmployeeList));
  // update chart after update
  this.updateChartData();
  this.onReset();
}

onDelete(id:number){
const isDelete=confirm("Are you sure want to delete");
if(isDelete){
  const index=this.EmployeeList.findIndex(m=>m.empid==id);
  this.EmployeeList.splice(index,1);
  localStorage.setItem("EmpData",JSON.stringify(this.EmployeeList));
  // update chart after delete
  this.updateChartData();
}
}

updateChartData(){
  this.chartData=this.EmployeeList.map(e=>({
name:e.ename,
// using contactno as value for demonstration
value:+e.contactno
  }));
}
}
