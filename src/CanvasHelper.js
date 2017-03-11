"use strict";

module.exports = CanvasHelper;
var Position = require('./model/Position');
var DirectedEdge = require('./model/DirectedEdge');

/**
 * @param {HTMLCanvasElement} canvas
 * @constructor
 */
function CanvasHelper(canvas) {
    this._context = canvas.getContext('2d');
    this._width = canvas.width;
    this._height = canvas.height;
    this._fontSize = 13;
    this._ratio = 0.5;
    this._arrowLength = 20;
}

CanvasHelper.prototype.clearCanvas = function () {
    this._context.clearRect(0, 0, this._width, this._height);
};

/**
 * @param {boolean} isDirected
 * @param {Position} fromPosition
 * @param {Position} toPosition
 * @param {number} [lineWidth]
 * @param {*} [strokeStyle]
 */
CanvasHelper.prototype.drawLine = function (isDirected, fromPosition, toPosition, lineWidth, strokeStyle) {
    if (lineWidth) {
        if (!Number.isInteger(lineWidth) || lineWidth < 1) {
            throw new TypeError('LineWidth must be a positive integer, given: ' + lineWidth);
        }
        this._context.lineWidth = lineWidth;
    }
    if (strokeStyle) {
        this._context.strokeStyle = strokeStyle;
    }

    this._context.beginPath();
    this._context.moveTo(fromPosition.getX(), fromPosition.getY());
    this._context.lineTo(toPosition.getX(), toPosition.getY());
    this._context.stroke();

    if (isDirected === true) {
        this._context.beginPath();
        var positionDivInRatio = this._getPositionDividedInRatio(this._ratio, fromPosition, toPosition);
        this._drawArrow(fromPosition, toPosition, positionDivInRatio);
    }
};

/**
 * Calculates position of the point, that divides the line in a given ratio
 *
 * @param {number} ratio
 * @param {Position} fromPosition
 * @param {Position} toPosition
 * @return {Position}
 * @private
 */
CanvasHelper.prototype._getPositionDividedInRatio = function (ratio, fromPosition, toPosition) {
    return new Position(
        (fromPosition.getX() + (ratio * toPosition.getX())) / (1 + ratio),
        (fromPosition.getY() + (ratio * toPosition.getY())) / (1 + ratio)
    );
};

/**
 * @param {Position} position
 * @param {number} radius
 * @param {*} textInside
 * @param {*} [color]
 */
CanvasHelper.prototype.drawCircle = function (position, radius, textInside, color) {
    this._context.beginPath();
    this._context.arc(position.getX(), position.getY(), radius, 0, Math.PI * 2);
    this._context.fillStyle = color || "#00f";
    this._context.fill();

    this._context.font = this._fontSize + 'pt Arial';
    this._context.fillStyle = '#fff';
    this._context.textAlign = 'center';
    this._context.fillText(textInside, position.getX(), position.getY() + this._fontSize / 2);
};

/**
 * @param {Edge[]} edges
 */
CanvasHelper.prototype.drawEdges = function (edges) {
    var generateShift = this._getShiftGenerator(edges.length);
    var that = this;
    edges.forEach(function (edge) {
        var vertices = edge.getVertices(),
            fromX = vertices[0].getPosition().getX(),
            fromY = vertices[0].getPosition().getY(),
            toX = vertices[1].getPosition().getX(),
            toY = vertices[1].getPosition().getY();

        that._context.beginPath();
        that._context.moveTo(fromX, fromY);
        var shiftX = (fromX + toX) / 2;
        var shiftY = (fromY + toY) / 2;
        shiftY += generateShift();
        that._context.quadraticCurveTo(shiftX, shiftY, toX, toY);
        that._context.stroke();
        if (edge instanceof DirectedEdge) {
            that._context.beginPath();
            var arrowStartPosition = new Position(
                that._getQuadraticCurveCoord(that._ratio, fromX, shiftX, toX),
                that._getQuadraticCurveCoord(that._ratio, fromY, shiftY, toY)
            );
            that._drawArrow(vertices[0].getPosition(), vertices[1].getPosition(), arrowStartPosition);
        }
    });
};

/**
 * https://ru.wikipedia.org/wiki/%D0%9A%D1%80%D0%B8%D0%B2%D0%B0%D1%8F_%D0%91%D0%B5%D0%B7%D1%8C%D0%B5#.D0.9A.D0.B2.D0.B0.D0.B4.D1.80.D0.B0.D1.82.D0.B8.D1.87.D0.BD.D1.8B.D0.B5_.D0.BA.D1.80.D0.B8.D0.B2.D1.8B.D0.B5
 * @param {number} t
 * @param {number} p0
 * @param {number} p1
 * @param {number} p2
 * @return {number}
 * @private
 */
CanvasHelper.prototype._getQuadraticCurveCoord = function (t, p0, p1, p2) {
    if (t < 0 || t > 1) {
        throw new Error('Parameter t must be in range from 0 to 1');
    }
    return Math.pow(1 - t, 2) * p0 + 2 * (1 - t) * t * p1 + Math.pow(t, 2) * p2;
};


/**
 * https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%B2%D0%BE%D1%80%D0%BE%D1%82#.D0.9F.D0.BE.D0.B2.D0.BE.D1.80.D0.BE.D1.82_.D0.B2_.D0.B4.D0.B2.D1.83.D0.BC.D0.B5.D1.80.D0.BD.D0.BE.D0.BC_.D0.BF.D1.80.D0.BE.D1.81.D1.82.D1.80.D0.B0.D0.BD.D1.81.D1.82.D0.B2.D0.B5
 * @param {Position} fromPosition
 * @param {Position} toPosition
 * @param {Position} arrowStartPosition
 * @private
 */
CanvasHelper.prototype._drawArrow = function (fromPosition, toPosition, arrowStartPosition) {
    var fromX = fromPosition.getX();
    var fromY = fromPosition.getY();
    var toX = toPosition.getX();
    var toY = toPosition.getY();

    var angle = Math.atan2(toY - fromY, toX - fromX);
    var rotationAngle = Math.PI / 6;

    var x = arrowStartPosition.getX();
    var y = arrowStartPosition.getY();

    this._context.moveTo(x, y);
    this._context.lineTo(
        x - this._arrowLength * Math.cos(angle - rotationAngle),
        y - this._arrowLength * Math.sin(angle - rotationAngle)
    );
    this._context.moveTo(x, y);
    this._context.lineTo(
        x - this._arrowLength * Math.cos(angle + rotationAngle),
        y - this._arrowLength * Math.sin(angle + rotationAngle)
    );
    this._context.stroke();
};

/**
 * @param {number} edgesCount
 * @return {Function} - Callback that generates shift for the next parallel edge
 * @private
 */
CanvasHelper.prototype._getShiftGenerator = function (edgesCount) {
    if (edgesCount < 1) {
        throw new Error('Edges count must be positive');
    }
    var distanceBetweenEdges = 50;
    var shift = (edgesCount % 2 === 0) ? distanceBetweenEdges : 0;
    return function () {
        var oldShift = shift;
        if (shift > 0) {
            shift *= -1;
        } else {
            shift = Math.abs(shift) + distanceBetweenEdges;
        }
        return oldShift;
    }
};