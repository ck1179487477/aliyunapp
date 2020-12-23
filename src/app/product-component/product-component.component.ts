import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-component',
  templateUrl: './product-component.component.html',
  styleUrls: ['./product-component.component.css']
})
export class ProductComponentComponent implements OnInit {
  updateOption: any;
  chartOption: any;

  public xAxis = [];
  public temps = [];
  public humds = [];

  constructor(private httpclient: HttpClient) {
    this.chartOption = {
      title: {
        text: '温湿度跟踪器'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['温度', '湿度']
      },
      toobox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLable: true
      },
      xAxis: [
        {
          type: 'catrgory',
          boundaryGap: false,
          data: []
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '温度',
          type: 'line',
          stack: '度',
          areaStyle: { normal: {} },
          data: []
        },
        {
          name: '温度',
          type: 'line',
          stack: '%',
          areaStyle: { normal: {} },
          data: []
        },
      ]
    };
    this.updateOption = {};
  }

  ngOnInit(): void {
    console.log('123');
    timer(2000, 2000).subscribe(() => {

      this.httpclient.get('http://192.168.43.186:8080/ws/002').subscribe((value: any) => {
        if (value && value.data && value.data.length) {
          let i = value.data.length - 1;
          for (let item of value.data) {
            const d = new Date(Number(item.time));
            this.xAxis[i] = d.getHours() > 9 ? d.getHours() : '0' + d.getHours();
            this.xAxis[i] += ":" + (d.getMinutes() > 9 ? d.getMinutes() : 0 + d.getMinutes());
            this.xAxis[i] += ":" + (d.getSeconds() > 9 ? d.getSeconds() : 0 + d.getSeconds());
            this.temps[i] = (item.temp);
            this.humds[i] = (item.humd);
            i--;
          }
          this.updateOption = {
            xAxis: [
              {
                data: this.xAxis
              }
            ],
            series: [
              {
                data: this.temps
              }, {
                data: this.humds
              }
            ]
          }
        }
      })
    })
  }




}