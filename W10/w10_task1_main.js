let data = [];

// 1. 外部データの読み込み
d3.csv("https://naka0120.github.io/InfoVis2025/W10/w10_task1.csv")
    .then(rows => {
        data = rows.map(r => ({
            label: r.types,       // 項目名
            value: +r.width,     // 数値（+で数値変換）
            color: r.color       // 色
        }));
        update(data);
    })
    .catch(err => {
        console.error("Failed to load CSV:", err);
    });

const svg = d3.select('#drawing_region');

function update(data) {
    const padding = 10;
    const barHeight = 20;

    // データジョイン（keyとして label を指定するのがポイント）
    svg.selectAll("rect")
        .data(data, d => d.label) // これによりアニメーションがラベルに紐付く
        .join(
            enter => enter.append("rect")
                .attr("x", padding)
                .attr("y", (d, i) => padding + i * (barHeight + padding))
                .attr("width", 0) // 最初は幅0
                .attr("height", barHeight)
                .attr("fill", d => d.color),
            update => update, // 既存の要素
            exit => exit.remove()
        )
        // 2. アニメーションの実装
        .transition().duration(1000)
        .attr("y", (d, i) => padding + i * (barHeight + padding)) // 並び替え後の位置へ移動
        .attr("width", d => d.value)
        .attr("fill", d => d.color);
}

// 3. ソートボタンのイベント（Reverse）
d3.select('#reverse')
    .on('click', () => {
        data.reverse();
        update(data);
    });

// 4. 追加：昇順/降順ソート（課題の要件）
d3.select('#ascend') // HTMLにid="ascend"のボタンがある想定
    .on('click', () => {
        data.sort((a, b) => d3.ascending(a.value, b.value));
        update(data);
    });

d3.select('#descend') // HTMLにid="descend"のボタンがある想定
    .on('click', () => {
        data.sort((a, b) => d3.descending(a.value, b.value));
        update(data);
    });