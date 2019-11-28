function distQuant(data, id) {

    function getPoints(_, i) {
        return _.map(function(d, j) {
            return {
                x: j,
                y: d[i]
            };
        });
    }
    /* function to return 0 for all attributes except k-th attribute.*/
    function getPointsZero(_, i, k, type) {
        return _.map(function(d, j) {
            if (type == 'dist') {
                return {
                    x: j,
                    y: (k.indexOf(i)>=0 ? d[i] : 0)
                };
            } else {
                var sum = 0;
                for (var s = 0; s < k.length; s++) {
                    sum += d[k[s]];
                }
                var y;
                if (sum == 0) {
                    y = 0;
                } else {
                    y = (k.indexOf(i)>=0 ? d[i] / sum : 0);
                }

                return {
                    x: j,
                    y: y
                };
            }
        });
    }

    var width = 400,
        height = 300,
        margin = 25;
    var colors = ["#cccccc", "#f44336", "#ff9800", "#ffc107", "#ffeb3b", "#8bc34a", "#4caf50", "#00bcd4"].reverse();

    var mode = "linear";

    function draw(type) {
        var maxT = d3.max(data[type].map(function(d) {
            return d3.sum(d);
        }));

        function tW(d) {
            return x(d * (data[type].length - 1) / 50);
        }

        function tH(d) {
            return y(d * maxT / 50);
        }

        var svg = d3.select("#" + id).select("." + type);

        //x and y axis maps.
        var x = d3.scale.linear().domain([0, data[type].length - 1]).range([0, width]);
        // var y = d3.scale.log().base(0.5).domain([1, maxT]).range([height, 0]);
        var y = mode == 'linear'?
            (d3.scale.linear().domain([0, maxT]).range([height, 0])):
            (d3.scale.pow().exponent(2).domain([0, maxT]).range([height, 0]));
        // var y = d3.scale.linear().domain([0, maxT]).range([height, 0]);

        //draw yellow background for graph.
        svg.append("rect").attr("x", 0).attr("y", 0).attr("width", width).attr("height", height).style("fill", "transparent");//rgb(235,235,209)");

        // draw vertical lines of the grid.
        svg.selectAll(".vlines").data(d3.range(51)).enter().append("line").attr("class", "vlines")
            .attr("x1", tW).attr("y1", 0)
            .attr("x2", tW).attr("y2", function(d, i) {
                return d % 10 == 0 && d != 50 ? height + 12 : height;
            });

        //draw horizontal lines of the grid.
        svg.selectAll(".hlines").data(d3.range(51)).enter().append("line").attr("class", "hlines")
            .attr("x1", function(d, i) {
                return d % 10 == 0 && d != 50 ? -12 : 0;
            })
            .attr("y1", tH).attr("x2", width).attr("y2", tH);

        // make every 10th line in the grid darker.
        svg.selectAll(".hlines").filter(function(d) {
            return d % 10 == 0
        }).style("stroke-opacity", 0.7);
        svg.selectAll(".vlines").filter(function(d) {
            return d % 10 == 0
        }).style("stroke-opacity", 0.7);

        function getHLabel(d, i) {
            var date = new Date(i*(tmax-tmin)/5+tmin);
            return (date.getMonth()+1)+'-'+date.getDate();
            /*
            if (type == "dist") { // for distribution graph use the min and max to get the 5 label values.
                var r = data.distMin + i * (data.distMax - data.distMin) / 5;
                return Math.round(r * 100) / 100;
            } else { // for quantile graph, use label 20, 40, 60, and 80.
                return (i * 20) + ' %';
            }
            */
        }

        function getVLabel(d, i) {
            if (i==0) return '';
            if (type == "dist") { // for dist use the maximum for sum of frequencies and divide it into 5 pieces.
                return Math.round(maxT * i / 5);
            } else { // for quantile graph, use percentages in increments of 20%.
                return (i * 20) + ' %';
            }
        }
        // add horizontal axis labels
        svg.append("g").attr("class", "hlabels")
            .selectAll("text").data(d3.range(41).filter(function(d) {
                return d % 10 == 0
            })).enter().append("text")
            .text(getHLabel).attr("x", function(d, i) {
                return tW(d) + 5;
            }).attr("y", height + 14);

        // add vertical axes labels.
        svg.append("g").attr("class", "vlabels")
            .selectAll("text").data(d3.range(51).filter(function(d) {
                return d % 10 == 0
            })).enter().append("text")
            .attr("transform", function(d, i) {
                return "translate(-10," + (tH(d) +(i==5?21:-14)) + ")rotate(-90)";
            })
            .text(getVLabel).attr("x", -10).attr("y", function(d, i) {
                return 5;
            });

        var area = d3.svg.area().x(function(d) {
                return x(d.x);
            })
            .y0(function(d) {
                return y(d.y0);
            })
            .y1(function(d) {
                return y(d.y0 + d.y);
            });
            // .interpolate("basis");

        var layers = d3.layout.stack().offset("zero")(data.dP.map(function(d, i) {
            return getPoints(data[type], i);
        }));

        svg.selectAll("path").data(layers).enter().append("path").attr("d", area)
            .style("fill", function(d, i) {
                return colors[i];
            })
            .style("stroke", function(d, i) {
                return colors[i];
            });

        //draw a white rectangle to hide and to show some statistics.
        var stat = svg.append("g").attr("class", "stat");

        // stat.append("rect").attr("x", -margin).attr("y", -margin)
        //     .attr("width", width + 2 * margin).attr("height", margin).style("fill", "white");

    }

    function transitionIn(type, p) {
        var maxT = d3.max(data[type].map(function(d) {
            return d3.sum(d);
        }));
        var max = d3.max(data[type].map(function(d) {
            var sum = 0;
            for (var i in p) {
                sum += d[p[i]];
            }
            return type=='dist'?sum:1;
        }));
//        console.log(max);

        var x = d3.scale.linear().domain([0, data[type].length - 1]).range([0, width]);
        // var y = d3.scale.linear().domain([0, max]).range([height, 0]);
        var y = d3.scale.pow().exponent(2).domain([0, max]).range([height, 0]);
        var y = mode == 'linear'?
            (d3.scale.linear().domain([0, max]).range([height, 0])):
            (d3.scale.pow().exponent(2).domain([0, max]).range([height, 0]));

        function tW(d) {
            return x(d * (data[type].length - 1) / 50);
        }

        function tH(d) {
            return y(d * maxT / 50);
        }

        var area = d3.svg.area().x(function(d) {
                return x(d.x);
            })
            .y0(function(d) {
                return y(d.y0);
            })
            .y1(function(d) {
                return y(d.y0 + d.y);
            });
            // .interpolate("basis");

        var layers = d3.layout.stack().offset("zero")(data.dP.map(function(d, i) {
            return getPointsZero(data[type], i, p, type);
        }));
        var svg = d3.select("#" + id).select("." + type);
        //transition all the lines, labels, and areas.
        svg.selectAll("path").data(layers).transition().duration(500).attr("d", area);

        svg.selectAll(".vlines").transition().duration(500).attr("x1", tW).attr("x2", tW);
        svg.selectAll(".hlines").transition().duration(500).attr("y1", tH).attr("y2", tH);
        svg.selectAll(".vlabels").selectAll("text").transition().duration(500)
            .attr("transform", function(d, i) {
                return "translate(-10," + (tH(d) - 14) + ")rotate(-90)";
                return "translate(-10," + (tH(d) +(i==5?21:-14)) + ")rotate(-90)";

            });
    }

    function transitionOut(type) {
        var maxT = d3.max(data[type].map(function(d) {
            return d3.sum(d);
        }));

        function tW(d) {
            return x(d * (data[type].length - 1) / 50);
        }

        function tH(d) {
            return y(d * maxT / 50);
        }

        var x = d3.scale.linear().domain([0, data[type].length - 1]).range([0, width]);
        // var y = d3.scale.linear().domain([0, maxT]).range([height, 0]);
        var y = d3.scale.pow().exponent(2).domain([0, maxT]).range([height, 0]);

        var area = d3.svg.area().x(function(d) {
                return x(d.x);
            })
            .y0(function(d) {
                return y(d.y0);
            })
            .y1(function(d) {
                return y(d.y0 + d.y);
            });
            // .interpolate("basis");
        var layers = d3.layout.stack().offset("zero")(data.dP.map(function(d, i) {
            return getPoints(data[type], i);
        }));

        // transition the lines, areas, and labels.
        var svg = d3.select("#" + id).select("." + type);
        svg.selectAll("path").data(layers).transition().duration(500).attr("d", area);
        svg.selectAll(".vlines").transition().duration(500).attr("x1", tW).attr("x2", tW);
        svg.selectAll(".hlines").transition().duration(500).attr("y1", tH).attr("y2", tH);
        svg.selectAll(".vlabels").selectAll("text").transition().duration(500)
            .attr("transform", function(d, i) {
                return "translate(-10," + (tH(d) +(i==5?21:-14)) + ")rotate(-90)";
            });

    }

    function mouseoverLegend(_, p) {
        transitionIn("dist", p);
        transitionIn("quant", p);
    }

    function mouseoutLegend() {
        transitionOut("dist");
        transitionOut("quant");
    }
    // add title.
    // d3.select("#" + id).append("h3").text(data.title);

    // add svg and set attributes for distribution.
    d3.select("#" + id).append("svg").attr("width", width + 2 * margin).attr("height", height + margin)
        .append("g").attr("transform", "translate(" + margin + "," + 0 + ")").attr("class", "dist");

    //add svg and set attributes for quantil.
    d3.select("#" + id).append("svg").attr("width", width + 2 * margin).attr("height", height + margin)
        .append("g").attr("transform", "translate(" + margin + "," + 0 + ")").attr("class", "quant");

    // Draw the two graphs.
    draw("dist");
    draw("quant");

    // draw legends.

    // var legRow = d3.select("#" + id).append("div").attr("class", "legend")
    //     .append("table").selectAll("tr").data(data.dP).enter().append("tr").append("td");
    // legRow.append("div").style("background", function(d, i) {
    //         return colors[i];
    //     })
    //     .on("mouseover", mouseoverLegend).on("mouseout", mouseoutLegend).style("cursor", "pointer");
    //
    // legRow.append("span").text(function(d) {
    //         return d[0];
    //     })
    //     .on("mouseover", mouseoverLegend).on("mouseout", mouseoutLegend).style("cursor", "pointer");
    var drawp = function(e) {
        // var t = e.target;
        var p = [];
        for (var j = 0; j < 8; j++) {
            if ($('#label_' + j)[0].checked) p.push(7-j);
        }
        transitionIn('dist', p);
        transitionIn('quant', p);
    }

    for (var i = 0; i < 8; i++) {
        $('#label_' + i).click(drawp);
    }
    $('#contentDiv svg').click(function() {
        if (mode == "linear")
            mode = "pow";
        else
            mode = "linear";

        drawp();
    });
}

function drawAll(data, id) {

    var seg = d3.select("#" + id).selectAll("div").data(d3.range(data.length)).enter()
        .append("div").attr("id", function(d, i) {
            return "segment" + i;
        }).attr("class", "distquantdiv");

    d3.range(data.length).forEach(function(d, i) {
        distQuant(data[i], "segment" + i);
    });
}
