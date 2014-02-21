/*
* Climb
* 
* Copyright (C) 2014 Tarek Sherif 
* 
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
* 
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function() {
  "use strict";

  window.createBox = oFactory({
    draw: function(context) {
      context.save();
      context.translate(this.x + this.width / 2, this.y + this.height / 2);
      context.rotate(this.rotation);
      context.scale(this.scale_x, this.scale_y);
      context.globalAlpha = this.alpha;
      context.lineWidth = this.lineWidth;
      context.fillStyle = this.color;
      context.beginPath();
      context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
      context.fill();
      if (this.lineWidth > 0) {
        context.stroke();
      }
      context.restore();
    }
  }).mixin({
    color: "#FFFFFF",
    x: 0,
    y: 0,
    width: 20,
    height: 10,
    rotation: 0,
    scale_x: 1,
    scale_y: 1,
    lineWidth: 0,
    alpha: 1
  });
  
})();
