var data = [];

d3.csv("https://naka0120.github.io/InfoVis2025/W04/w04_task2.csv")
    .then(rows => {
        // parse the first column of each row as a number
        data = rows.map(r => {
            const v = Object.values(r)[0];
            return +v;
        }).filter(n => !isNaN(n));
        update(data);
    })
    .catch(err => {
        console.error("Failed to load CSV:", err);
    });


var svg = d3.select('#drawing_region');
update( data );

function update(data) {
    let padding = 10;
    let height = 15;

    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .transition().duration(1000)
        .attr("x", padding)
        .attr("y", (d,i) => padding + i * ( height + padding ))
        .attr("width", d => d)
        .attr("height", height);
}

d3.select('#reverse')
    .on('click', d => {
        data.reverse();
        update(data);
    });

