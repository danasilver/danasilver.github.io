function spinner(selection) {
  var spinnerHeight = 100,
      spinnerWidth = 100,
      margin = {
        top: selection.attr('height') / 2 - spinnerHeight / 2,
        left: selection.attr('width') / 2 - spinnerWidth / 2
      };

  var stroke = selection.append('path')
      .attr('class', 'stroke')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .attr('d', 'M50,0 A25,25 0 0,0 50,100 A25,25 0 0,0 50,0')
      .style('fill', 'none')
      .style('stroke', '#000')
      .style('stroke-width', '5px')
      .style('stroke-linecap', 'round');

  function animate() {
    stroke.interrupt().transition();

    stroke.transition().each(function() {
      var length = this.getTotalLength(),
          duration = length * 10;

      d3.select(this)
          .style('stroke-dasharray', '0,' + length)
        .transition()
          .duration(duration)
          .style('stroke-dasharray', '1,1')
        .transition()
          .duration(duration)
          .style('stroke-dasharray', '0,' + length)
          .each('end', animate);
    });
  }

  animate();

  return stroke;
}
