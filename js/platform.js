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
  
  window.createPlatform = createBox.clone().share({
    translate: function(x_offset, y_offset) {
      this.x += x_offset;
      this.y += y_offset;
      this.origin_x += x_offset;
      this.origin_y += y_offset;
      this.last_x += x_offset;
      this.last_y += y_offset;

      if (this.left_limit !== null) this.left_limit += x_offset;
      if (this.right_limit !== null) this.right_limit += x_offset;
      if (this.top_limit !== null) this.top_limit += y_offset;
      if (this.bottom_limit !== null) this.bottom_limit += y_offset;
    },
    updatePosition: function(time) {
      this.last_x = this.x;
      this.last_y = this.y;
      
      if (this.range_x){
        this.x = this.origin_x + Math.sin(time / 1000) * this.range_x;
      } else {
        this.x = this.origin_x;
      }

      if (this.range_y){
        this.y = this.origin_y + Math.sin(time / 1000) * this.range_y;
      } else {
        this.y = this.origin_y;
      }


      if (this.movingHorizontal()) {
        if (this.left_limit !== null) {
          if (this.x <= this.left_limit) {
            this.x = this.left_limit;
          } else {
            this.left_limit = null;
          }
        }

        if (this.right_limit !== null) {
          if (this.x >= this.right_limit) {
            this.x = this.right_limit;
          } else {
            this.right_limit = null;
          }
        }
      }
      if (this.movingVertical()) {
        if (this.top_limit !== null) {
          if (this.y <= this.top_limit) {
            this.y = this.top_limit;
          } else {
            this.top_limit = null;
          }
        }

        if (this.bottom_limit !== null) {
          if (this.y >= this.bottom_limit) {
            this.y = this.bottom_limit;
          } else {
            this.bottom_limit = null;
          }
        }
      }

      this.vx = this.x - this.last_x;
      this.vy = this.y - this.last_y;
    },
    movingHorizontal: function() {
      return !!this.range_x;
    },
    movingVertical: function() {
      return !!this.range_y;
    }
  }).mixin({
    origin_x: null,
    origin_y: null,
    range_x: 0,
    range_y: 0,
    left_limit: null,
    right_limit: null,
    top_limit: null,
    bottom_limit: null
  }).init(function(self) {
    if (typeof self.origin_x !== "number") {
      self.origin_x = self.x;
    }
    if (typeof self.origin_y !== "number") {
      self.origin_y = self.y;
    }
  });
})();
