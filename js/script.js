// Dummy training data based on the provided sample
const trainingData = [
    {H2: 54.54, CH4: 71.93, C2H6: 9.72, C2H4: 93.37, C2H2: 6.58, fault: 'T3'},
    {H2: 5760, CH4: 540, C2H6: 40.5, C2H4: 1000, C2H2: 2760, fault: 'D2'},
    {H2: 20, CH4: 80.2, C2H6: 24.6, C2H4: 68.6, C2H2: 0, fault: 'T2'},
    {H2: 15.9, CH4: 55.98, C2H6: 22.33, C2H4: 137.25, C2H2: 0.21, fault: 'T3'},
    {H2: 40, CH4: 102.6, C2H6: 32.3, C2H4: 183.3, C2H2: 0.2, fault: 'D2'},
    {H2: 2.369, CH4: 119.69, C2H6: 21.891, C2H4: 20.15, C2H2: 0, fault: 'T1'},
    {H2: 87.17, CH4: 17.26, C2H6: 3.94, C2H4: 12.87, C2H2: 32.81, fault: 'D1'},
    {H2: 605, CH4: 1586, C2H6: 655, C2H4: 1901, C2H2: 2.3, fault: 'T3'},
    {H2: 462, CH4: 212.4, C2H6: 31.6, C2H4: 0, C2H2: 0, fault: 'PD'},
    {H2: 131.7, CH4: 116.55, C2H6: 19.4, C2H4: 183.97, C2H2: 0.32, fault: 'T2'}
];

const faultDescriptions = {
    'T1': 'Low Temperature Thermal Fault',
    'T2': 'Medium Temperature Thermal Fault', 
    'T3': 'High Temperature Thermal Fault',
    'D1': 'Low Energy Electrical Discharge',
    'D2': 'High Energy Electrical Discharge',
    'PD': 'Partial Discharge'
};

const algorithms = [
    {name: 'Random Forest', accuracy: 95.2},
    {name: 'Decision Tree', accuracy: 86.5},
    {name: 'K-Nearest Neighbors', accuracy: 81.7},
    {name: 'Support Vector Machine', accuracy: 78.6},
    {name: 'Naive Bayes', accuracy: 74.6}
];

function analyzeGases() {
    const h2 = parseFloat(document.getElementById('h2').value) || 0;
    const ch4 = parseFloat(document.getElementById('ch4').value) || 0;
    const c2h6 = parseFloat(document.getElementById('c2h6').value) || 0;
    const c2h4 = parseFloat(document.getElementById('c2h4').value) || 0;
    const c2h2 = parseFloat(document.getElementById('c2h2').value) || 0;

    if (h2 === 0 && ch4 === 0 && c2h6 === 0 && c2h4 === 0 && c2h2 === 0) {
        alert('Please enter at least one gas concentration value.');
        return;
    }

    const inputGases = {H2: h2, CH4: ch4, C2H6: c2h6, C2H4: c2h4, C2H2: c2h2};

    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';

    // Simulate analysis delay
    setTimeout(() => {
        const predictions = simulateMLPredictions(inputGases);
        displayResults(inputGases, predictions);

        document.getElementById('loading').style.display = 'none';
        document.getElementById('results').style.display = 'block';
    }, 2000);
}

/*Important Functions - to be change with Python data*/

function simulateMLPredictions(inputGases) {
    const baseFault = predictFault(inputGases);
    const faults = Object.keys(faultDescriptions);

    return algorithms.map((algo, index) => {
        // Simulate some variation in predictions
        let predictedFault = baseFault;
        if (Math.random() > 0.7) {
            predictedFault = faults[Math.floor(Math.random() * faults.length)];
        }

        const confidence = Math.max(60, algo.accuracy + (Math.random() - 0.5) * 20);

        return {
            algorithm: algo.name,
            fault: predictedFault,
            confidence: Math.round(confidence * 100) / 100,
            accuracy: algo.accuracy
        };
    });
}

function displayResults(inputGases, predictions) {
    // Display gas values
    const gasValues = document.getElementById('gasValues');
    gasValues.innerHTML = `
                        <div class="gas-item"><div class="gas-name">H₂</div><div class="gas-value">${inputGases.H2} ppm</div></div>
                        <div class="gas-item"><div class="gas-name">CH₄</div><div class="gas-value">${inputGases.CH4} ppm</div></div>
                        <div class="gas-item"><div class="gas-name">C₂H₆</div><div class="gas-value">${inputGases.C2H6} ppm</div></div>
                        <div class="gas-item"><div class="gas-name">C₂H₄</div><div class="gas-value">${inputGases.C2H4} ppm</div></div>
                        <div class="gas-item"><div class="gas-name">C₂H₂</div><div class="gas-value">${inputGases.C2H2} ppm</div></div>
                        `;
    
    // Display Final Verdict 
    const finalVerdict = document.getElementById('finalVerdict');
    finalVerdict.innerHTML = ''+getFinalDecision(predictions)+'';

    // Populate results table
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    predictions.forEach(pred => {
        const row = document.createElement('tr');
        const status = pred.confidence > 80 ? 'High Confidence' : pred.confidence > 60 ? 'Medium Confidence' : 'Low Confidence';

        row.innerHTML = `
                        <td><strong>${pred.algorithm}</strong></td>
                        <td>
                            <span class="fault-badge fault-${pred.fault}">${pred.fault}</span>
                            <div style="font-size: 12px; color: #666; margin-top: 5px;">
                            ${faultDescriptions[pred.fault]}
                            </div>
                        </td>
                        <td>
                            <div>${pred.confidence.toFixed(1)}%</div>
                            <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${pred.confidence}%"></div>
                            </div>
                        </td>
                        <td>${pred.accuracy}%</td>
                        <td>${status}</td>
                        `;
        tableBody.appendChild(row);
    });

    // Create charts
    createConfidenceChart(predictions);
    createFaultChart(predictions);
}

/*Important Functions - to be change with Python data*/


function calculateDistance(input, sample) {
    const gases = ['H2', 'CH4', 'C2H6', 'C2H4', 'C2H2'];
    let distance = 0;
    gases.forEach(gas => {
        distance += Math.pow(input[gas] - sample[gas], 2);
    });
    return Math.sqrt(distance);
}

function predictFault(inputGases) {
    // Simple KNN-like prediction using dummy logic
    const distances = trainingData.map(sample => ({
        distance: calculateDistance(inputGases, sample),
        fault: sample.fault
    }));

    distances.sort((a, b) => a.distance - b.distance);
    const nearestFaults = distances.slice(0, 3).map(d => d.fault);

    // Count occurrences
    const faultCounts = {};
    nearestFaults.forEach(fault => {
        faultCounts[fault] = (faultCounts[fault] || 0) + 1;
    });

    // Return most common fault
    return Object.keys(faultCounts).reduce((a, b) => 
                                           faultCounts[a] > faultCounts[b] ? a : b
                                          );
}

function createConfidenceChart(predictions) {
    const ctx = document.getElementById('confidenceChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: predictions.map(p => p.algorithm),
            datasets: [{
                label: 'Confidence (%)',
                data: predictions.map(p => p.confidence),
                backgroundColor: [
                    'rgba(231, 76, 60, 0.8)',
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(155, 89, 182, 0.8)',
                    'rgba(241, 196, 15, 0.8)'
                ],
                borderColor: [
                    'rgba(231, 76, 60, 1)',
                    'rgba(52, 152, 219, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(241, 196, 15, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function createFaultChart(predictions) {
    const ctx = document.getElementById('faultChart').getContext('2d');

    // Count fault occurrences
    const faultCounts = {};
    predictions.forEach(p => {
        faultCounts[p.fault] = (faultCounts[p.fault] || 0) + 1;
    });

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(faultCounts).map(fault => `${fault} - ${faultDescriptions[fault]}`),
            datasets: [{
                data: Object.values(faultCounts),
                backgroundColor: [
                    'rgba(231, 76, 60, 0.8)',
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(155, 89, 182, 0.8)',
                    'rgba(241, 196, 15, 0.8)',
                    'rgba(230, 126, 34, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

function getFinalDecision(predictions) {
    // Filter high-confidence predictions (>75%)
    const highConfidence = predictions.filter(p => p.confidence > 75);

    if (highConfidence.length >= 3) {
        // If 3+ algorithms are confident, use majority vote
        const votes = {};
        highConfidence.forEach(p => {
            votes[p.fault] = (votes[p.fault] || 0) + 1;
        });
        const winner = Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b);
        return `${winner} - ${faultDescriptions[winner]} (${votes[winner]}/${highConfidence.length} confident algorithms agree)`;
    } else {
        // Use highest combined score
        const best = predictions.reduce((max, current) => 
                                        (current.accuracy * current.confidence) > (max.accuracy * max.confidence) ? current : max
                                       );
        return `${best.fault} - ${faultDescriptions[best.fault]} (Best: ${best.algorithm} at ${best.confidence.toFixed(1)}% confidence)`;
    }
}


// Auto-fill sample data for demonstration
function fillSampleData() {
    document.getElementById('h2').value = '54.54';
    document.getElementById('ch4').value = '71.93';
    document.getElementById('c2h6').value = '9.72';
    document.getElementById('c2h4').value = '93.37';
    document.getElementById('c2h2').value = '6.58';
}

// Fill sample data on load
window.addEventListener('load', fillSampleData);
