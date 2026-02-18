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

  window.createMessage = oFactory({
    draw: function(context) {
      context.globalAlpha = this.alpha;
      context.font = this.font;
      context.fillStyle = this.color;
      context.textAlign = this.text_align;
      context.textBaseline = this.baseline;
      context.fillText(this.text, this.x, this.y);
    }
  }).mixin({
    font: "bold 40px Helvetica",
    color: "#FFFFFF",
    text: "Message",
    x: 0,
    y: 0,
    alpha: 1,
    baseline: "top"
  });

})();
