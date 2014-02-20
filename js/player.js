/*
* climb
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

  window.createPlayer = createBox.clone().share({
    animate: function() {
      var vx = Math.abs(this.vx);
      var vy = Math.abs(Math.min(this.vy, 0));

      var x_multiplier = 1 + vx / 50;
      var y_multiplier = 1 + vy / 50;

      this.width = this.base_width * x_multiplier / y_multiplier;
      this.height = this.base_height * y_multiplier / x_multiplier;
    },
    totalVX: function() {
      var vx = this.vx;
      if (this.onplatform) {
        vx += this.onplatform.vx;
      }
      return vx;
    },
    totalVY: function() {
      var vy = this.vy;
      if (this.onplatform) {
        vy += this.onplatform.vy;
      }
      return vy;
    },
    relativeVX: function(other) {
      return this.totalVX() - other.vx;
    },
    relativeVY: function(other) {
      return this.totalVY() - other.vy;
    }
  }).init(function() {
    this.base_width = this.width;
    this.base_height = this.height;
  });

})();
