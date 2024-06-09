document.addEventListener('DOMContentLoaded', function() {
    const distSelect = document.getElementById('distribution');
    const paramsDiv = document.getElementById('params');
    const plotDiv = document.getElementById('plot');
    const formulaDiv = document.getElementById('formula');

    distSelect.addEventListener('change', updateParams);
    updateParams();

    function updateParams() {
        const dist = distSelect.value;
        paramsDiv.innerHTML = '';
        plotDiv.innerHTML = '';
        formulaDiv.innerHTML = '';

        let params = [];

        switch (dist) {
            case 'bernoulli':
                params = [
                    { label: 'p（成功概率）', type: 'number', min: 0, max: 1, step: 0.01, value: 0.5 }
                ];
                formulaDiv.innerHTML = `
                    <h3>伯努利分布</h3>
                    <p>描述：伯努利分布是一个离散型概率分布，表示单次试验成功的概率。</p>
                    <p>公式：\\(P(X = 1) = p, \\; P(X = 0) = 1 - p\\)</p>
                    <p>期望：\\(E(X) = p\\)</p>
                    <p>方差：\\(\\mathrm{Var}(X) = p(1 - p)\\)</p>
                `;
                break;
            case 'binomial':
                params = [
                    { label: 'n（试验次数）', type: 'number', min: 1, max: 100, step: 1, value: 10 },
                    { label: 'p（成功概率）', type: 'number', min: 0, max: 1, step: 0.01, value: 0.5 }
                ];
                formulaDiv.innerHTML = `
                    <h3>二项分布</h3>
                    <p>描述：二项分布是指在n次独立的伯努利试验中成功k次的概率分布。</p>
                    <p>公式：\\(P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k}\\)</p>
                    <p>期望：\\(E(X) = np\\)</p>
                    <p>方差：\\(\\mathrm{Var}(X) = np(1 - p)\\)</p>
                `;
                break;
            case 'poisson':
                params = [
                    { label: 'λ（平均事件数）', type: 'number', step: 0.01, value: 1 }
                ];
                formulaDiv.innerHTML = `
                    <h3>泊松分布</h3>
                    <p>描述：泊松分布描述在固定时间间隔内发生某事件的次数。</p>
                    <p>公式：\\(P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}\\)</p>
                    <p>期望：\\(E(X) = \\lambda\\)</p>
                    <p>方差：\\(\\mathrm{Var}(X) = \\lambda\\)</p>
                `;
                break;
            case 'uniform':
                params = [
                    { label: 'a（下限）', type: 'number', step: 0.01, value: 0 },
                    { label: 'b（上限）', type: 'number', step: 0.01, value: 1 }
                ];
                formulaDiv.innerHTML = `
                    <h3>均匀分布</h3>
                    <p>描述：均匀分布是指在区间[a, b]上的所有值都具有相同的概率。</p>
                    <p>公式：\\(f(x) = \\frac{1}{b - a}, \\; a \\leq x \\leq b\\)</p>
                    <p>期望：\\(E(X) = \\frac{a + b}{2}\\)</p>
                    <p>方差：\\(\\mathrm{Var}(X) = \\frac{(b - a)^2}{12}\\)</p>
                `;
                break;
            case 'exponential':
                params = [
                    { label: 'λ（速率参数）', type: 'number', step: 0.01, value: 1 }
                ];
                formulaDiv.innerHTML = `
                    <h3>指数分布</h3>
                    <p>描述：指数分布用于描述事件发生的时间间隔，通常用于排队论和生存分析。</p>
                    <p>公式：\\(f(x) = \\lambda e^{-\\lambda x}, \\; x \\geq 0\\)</p>
                    <p>期望：\\(E(X) = \\frac{1}{\\lambda}\\)</p>
                    <p>方差：\\(\\mathrm{Var}(X) = \\frac{1}{\\lambda^2}\\)</p>
                `;
                break;
            case 'gaussian':
                params = [
                    { label: 'μ（均值）', type: 'number', step: 0.01, value: 0 },
                    { label: 'σ（标准差）', type: 'number', step: 0.01, value: 1 }
                ];
                formulaDiv.innerHTML = `
                    <h3>高斯分布</h3>
                    <p>描述：高斯分布，也称为正态分布，是一种连续概率分布，在许多自然现象中广泛存在。</p>
                    <p>公式：\\(f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}\\)</p>
                    <p>期望：\\(E(X) = \\mu\\)</p>
                    <p>方差：\\(\\mathrm{Var}(X) = \\sigma^2\\)</p>
                `;
                break;
        }

        params.forEach(param => {
            const paramDiv = document.createElement('div');
            const label = document.createElement('label');
            label.textContent = param.label;
            const input = document.createElement('input');
            input.type = param.type;
            input.min = param.min;
            input.max = param.max;
            input.step = param.step;
            input.value = param.value;
            input.addEventListener('input', plot);
            paramDiv.appendChild(label);
            paramDiv.appendChild(input);
            paramsDiv.appendChild(paramDiv);
        });

        plot();
        MathJax.typeset();
    }

    function plot() {
        const dist = distSelect.value;
        const inputs = paramsDiv.querySelectorAll('input');
        const values = Array.from(inputs).map(input => parseFloat(input.value));

        let data = [];
        switch (dist) {
            case 'bernoulli':
                data = bernoulli(values[0]);
                break;
            case 'binomial':
                data = binomial(values[0], values[1]);
                break;
            case 'poisson':
                data = poisson(values[0]);
                break;
            case 'uniform':
                data = uniform(values[0], values[1]);
                break;
            case 'exponential':
                data = exponential(values[0]);
                break;
            case 'gaussian':
                data = gaussian(values[0], values[1]);
                break;
        }

        Plotly.newPlot(plotDiv, data);
    }

    function bernoulli(p) {
        return [{
            x: [0, 1],
            y: [1 - p, p],
            type: 'bar',
            width: [0.5, 0.5]
        }];
    }

    function binomial(n, p) {
        const x = Array.from({ length: n + 1 }, (_, k) => k);
        const y = x.map(k => math.combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k));
        return [{
            x,
            y,
            type: 'bar'
        }];
    }

    function poisson(lambda) {
        const x = Array.from({ length: 20 }, (_, k) => k);
        const y = x.map(k => (Math.pow(lambda, k) * Math.exp(-lambda)) / math.factorial(k));
        return [{
            x,
            y,
            type: 'bar'
        }];
    }

    function uniform(a, b) {
        const x = Array.from({ length: 100 }, (_, i) => a + (b - a) * i / 99);
        const y = Array(100).fill(1 / (b - a));
        return [{
            x,
            y,
            type: 'scatter',
            mode: 'lines'
        }];
    }

    function exponential(lambda) {
        const x = Array.from({ length: 100 }, (_, i) => i / 10);
        const y = x.map(x => lambda * Math.exp(-lambda * x));
        return [{
            x,
            y,
            type: 'scatter',
            mode: 'lines'
        }];
    }

    function gaussian(mu, sigma) {
        const x = Array.from({ length: 100 }, (_, i) => mu - 3 * sigma + 6 * sigma * i / 99);
        const y = x.map(x => 1 / (sigma * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)));
        return [{
            x,
            y,
            type: 'scatter',
            mode: 'lines'
        }];
    }
});
