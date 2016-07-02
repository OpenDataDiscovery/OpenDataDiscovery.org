(function(b){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=b()}else{if(typeof define==="function"&&define.amd){define([],b)}else{var a;if(typeof window!=="undefined"){a=window}else{if(typeof global!=="undefined"){a=global}else{if(typeof self!=="undefined"){a=self}else{a=this}}}a.vectorTile=b()}}})(function(){var d,b,a;return(function c(f,k,h){function g(q,n){if(!k[q]){if(!f[q]){var m=typeof require=="function"&&require;if(!n&&m){return m(q,!0)}if(e){return e(q,!0)}var p=new Error("Cannot find module '"+q+"'");throw p.code="MODULE_NOT_FOUND",p}var i=k[q]={exports:{}};f[q][0].call(i.exports,function(l){var o=f[q][1][l];return g(o?o:l)},i,i.exports,c,f,k,h)}return k[q].exports}var e=typeof require=="function"&&require;for(var j=0;j<h.length;j++){g(h[j])}return g})({1:[function(f,g,e){g.exports.VectorTile=f("./lib/vectortile.js");g.exports.VectorTileFeature=f("./lib/vectortilefeature.js");g.exports.VectorTileLayer=f("./lib/vectortilelayer.js")},{"./lib/vectortile.js":2,"./lib/vectortilefeature.js":3,"./lib/vectortilelayer.js":4}],2:[function(h,i,g){var j=h("./vectortilelayer");i.exports=e;function e(l,k){this.layers=l.readFields(f,{},k)}function f(k,n,m){if(k===3){var l=new j(m,m.readVarint()+m.pos);if(l.length){n[l.name]=l}}}},{"./vectortilelayer":4}],3:[function(g,e,j){var l=g("point-geometry");e.exports=m;function m(r,n,p,q,o){this.properties={};this.extent=p;this.type=0;this._pbf=r;this._geometry=-1;this._keys=q;this._values=o;r.readFields(i,this,n)}function i(n,o,p){if(n==1){o._id=p.readVarint()}else{if(n==2){h(p,o)}else{if(n==3){o.type=p.readVarint()}else{if(n==4){o._geometry=p.pos}}}}}function h(r,p){var n=r.readVarint()+r.pos;while(r.pos<n){var o=p._keys[r.readVarint()],q=p._values[r.readVarint()];p.properties[o]=q}}m.types=["Unknown","Point","LineString","Polygon"];m.prototype.loadGeometry=function(){var t=this._pbf;t.pos=this._geometry;var p=t.readVarint()+t.pos,o=1,n=0,s=0,r=0,u=[],v;while(t.pos<p){if(!n){var q=t.readVarint();o=q&7;n=q>>3}n--;if(o===1||o===2){s+=t.readSVarint();r+=t.readSVarint();if(o===1){if(v){u.push(v)}v=[]}v.push(new l(s,r))}else{if(o===7){if(v){v.push(v[0].clone())}}else{throw new Error("unknown command "+o)}}}if(v){u.push(v)}return u};m.prototype.bbox=function(){var z=this._pbf;z.pos=this._geometry;var r=z.readVarint()+z.pos,q=1,p=0,w=0,u=0,o=Infinity,n=-Infinity,v=Infinity,t=-Infinity;while(z.pos<r){if(!p){var s=z.readVarint();q=s&7;p=s>>3}p--;if(q===1||q===2){w+=z.readSVarint();u+=z.readSVarint();if(w<o){o=w}if(w>n){n=w}if(u<v){v=u}if(u>t){t=u}}else{if(q!==7){throw new Error("unknown command "+q)}}}return[o,v,n,t]};m.prototype.toGeoJSON=function(u,s,q){var C=this.extent*Math.pow(2,q),n=this.extent*u,w=this.extent*s,t=this.loadGeometry(),r=m.types[this.type],p,o;function v(x){for(var y=0;y<x.length;y++){var D=x[y],z=180-(D.y+w)*360/C;x[y]=[(D.x+n)*360/C-180,360/Math.PI*Math.atan(Math.exp(z*Math.PI/180))-90]}}switch(this.type){case 1:var A=[];for(p=0;p<t.length;p++){A[p]=t[p][0]}t=A;v(t);break;case 2:for(p=0;p<t.length;p++){v(t[p])}break;case 3:t=f(t);for(p=0;p<t.length;p++){for(o=0;o<t[p].length;o++){v(t[p][o])}}break}if(t.length===1){t=t[0]}else{r="Multi"+r}var B={type:"Feature",geometry:{type:r,coordinates:t},properties:this.properties};if("_id" in this){B.id=this._id}return B};function f(t){var n=t.length;if(n<=1){return[t]}var p=[],r,o;for(var q=0;q<n;q++){var s=k(t[q]);if(s===0){continue}if(o===undefined){o=s<0}if(o===s<0){if(r){p.push(r)}r=[t[q]]}else{r.push(t[q])}}if(r){p.push(r)}return p}function k(p){var r=0;for(var q=0,n=p.length,o=n-1,t,s;q<n;o=q++){t=p[q];s=p[o];r+=(s.x-t.x)*(t.y+s.y)}return r}},{"point-geometry":5}],4:[function(g,i,e){var f=g("./vectortilefeature.js");i.exports=j;function j(m,l){this.version=1;this.name=null;this.extent=4096;this.length=0;this._pbf=m;this._keys=[];this._values=[];this._features=[];m.readFields(h,this,l);this.length=this._features.length}function h(l,m,n){if(l===15){m.version=n.readVarint()}else{if(l===1){m.name=n.readString()}else{if(l===5){m.extent=n.readVarint()}else{if(l===2){m._features.push(n.pos)}else{if(l===3){m._keys.push(n.readString())}else{if(l===4){m._values.push(k(n))}}}}}}}function k(o){var n=null,m=o.readVarint()+o.pos;while(o.pos<m){var l=o.readVarint()>>3;n=l===1?o.readString():l===2?o.readFloat():l===3?o.readDouble():l===4?o.readVarint64():l===5?o.readVarint():l===6?o.readSVarint():l===7?o.readBoolean():null}return n}j.prototype.feature=function(m){if(m<0||m>=this._features.length){throw new Error("feature index out of bounds")}this._pbf.pos=this._features[m];var l=this._pbf.readVarint()+this._pbf.pos;return new f(this._pbf,l,this.extent,this._keys,this._values)}},{"./vectortilefeature.js":3}],5:[function(f,g,e){g.exports=h;function h(i,j){this.x=i;this.y=j}h.prototype={clone:function(){return new h(this.x,this.y)},add:function(i){return this.clone()._add(i)},sub:function(i){return this.clone()._sub(i)},mult:function(i){return this.clone()._mult(i)},div:function(i){return this.clone()._div(i)},rotate:function(i){return this.clone()._rotate(i)},matMult:function(i){return this.clone()._matMult(i)},unit:function(){return this.clone()._unit()},perp:function(){return this.clone()._perp()},round:function(){return this.clone()._round()},mag:function(){return Math.sqrt(this.x*this.x+this.y*this.y)},equals:function(i){return this.x===i.x&&this.y===i.y},dist:function(i){return Math.sqrt(this.distSqr(i))},distSqr:function(k){var j=k.x-this.x,i=k.y-this.y;return j*j+i*i},angle:function(){return Math.atan2(this.y,this.x)},angleTo:function(i){return Math.atan2(this.y-i.y,this.x-i.x)},angleWith:function(i){return this.angleWithSep(i.x,i.y)},angleWithSep:function(i,j){return Math.atan2(this.x*j-this.y*i,this.x*i+this.y*j)},_matMult:function(j){var i=j[0]*this.x+j[1]*this.y,k=j[2]*this.x+j[3]*this.y;this.x=i;this.y=k;return this},_add:function(i){this.x+=i.x;this.y+=i.y;return this},_sub:function(i){this.x-=i.x;this.y-=i.y;return this},_mult:function(i){this.x*=i;this.y*=i;return this},_div:function(i){this.x/=i;this.y/=i;return this},_unit:function(){this._div(this.mag());return this},_perp:function(){var i=this.y;this.y=this.x;this.x=-i;return this},_rotate:function(l){var k=Math.cos(l),j=Math.sin(l),i=k*this.x-j*this.y,m=j*this.x+k*this.y;this.x=i;this.y=m;return this},_round:function(){this.x=Math.round(this.x);this.y=Math.round(this.y);return this}};h.convert=function(i){if(i instanceof h){return i}if(Array.isArray(i)){return new h(i[0],i[1])}return i}},{}]},{},[1])(1)});