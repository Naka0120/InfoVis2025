d3.csv("https://naka0120.github.io/InfoVis2025/W10/w10_task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; d.r = +d.r; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:40, left:40}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear().range( [0, self.inner_width] );
        self.yscale = d3.scaleLinear().range( [self.inner_height, 0] ); // 軸を反転(下から上へ)

        self.xaxis = d3.axisBottom( self.xscale ).ticks(6);
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft( self.yscale ).ticks(6);
        self.yaxis_group = self.chart.append('g');

        // --- Task 2: ツールチップ用divの作成 ---
        self.tooltip = d3.select("body").append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "solid 1px black")
            .style("padding", "5px")
            .style("font-size", "12px")
            .style("border-radius", "4px");
    }

    update() {
        let self = this;
        self.xscale.domain( [0, d3.max( self.data, d => d.x )] );
        self.yscale.domain( [0, d3.max( self.data, d => d.y )] );
        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )
            .attr("fill", "black") // 初期の色
            // --- Task 2: マウスイベントの実装 ---
            .on("mouseover", (event, d) => {
                // 表示 & 色の変更 (Option: Change color)
                self.tooltip.style("visibility", "visible")
                    .html(`<strong>Data info</strong><br>X: ${d.x}<br>Y: ${d.y}`);
                
                d3.select(event.currentTarget)
                    .attr("fill", "orange")
                    .attr("r", d.r * 1.5); // 少し大きくして強調
            })
            .on("mousemove", (event) => {
                // ツールチップの位置を更新 (マウスに追従)
                self.tooltip
                    .style("top", (event.pageY - 20) + "px")
                    .style("left", (event.pageX + 15) + "px");
            })
            .on("mouseout", (event, d) => {
                // 非表示 & 色を戻す
                self.tooltip.style("visibility", "hidden");
                d3.select(event.currentTarget)
                    .attr("fill", "black")
                    .attr("r", d.r);
            });

        self.xaxis_group.call( self.xaxis );
        self.yaxis_group.call( self.yaxis );
    }
}