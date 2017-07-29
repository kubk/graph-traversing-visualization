"use strict";

const Position = require('./model/Position');
const DirectedEdge = require('./model/DirectedEdge');

class CanvasHelper {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.fontSize = 13;
        this.ratio = 0.5;
        this.arrowLength = 20;
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    /**
     * @param {Position} fromPosition
     * @param {Position} toPosition
     * @param {number} lineWidth
     * @param {string} strokeStyle
     */
    drawUndirectedLine(fromPosition, toPosition, lineWidth, strokeStyle) {
        if (lineWidth) {
            if (!Number.isInteger(lineWidth) || lineWidth < 1) {
                throw new TypeError('LineWidth must be a positive integer, given: ' + lineWidth);
            }
            this.context.lineWidth = lineWidth;
        }
        if (strokeStyle) {
            this.context.strokeStyle = strokeStyle;
        }

        this.context.beginPath();
        this.context.moveTo(fromPosition.getX(), fromPosition.getY());
        this.context.lineTo(toPosition.getX(), toPosition.getY());
        this.context.stroke();
    }

    /**
     * @param {Position} fromPosition
     * @param {Position} toPosition
     * @param {number} lineWidth
     * @param {string} strokeStyle
     */
    drawDirectedLine(fromPosition, toPosition, lineWidth, strokeStyle) {
        this.drawUndirectedLine(fromPosition, toPosition, lineWidth, strokeStyle);
        const positionDivInRatio = getPositionDividedInRatio(this.ratio, fromPosition, toPosition);
        this.drawArrow(fromPosition, toPosition, positionDivInRatio);
    }

    /**
     * @param {Position} position
     * @param {number} radius
     * @param {string} textInside
     * @param {string} color
     */
    drawCircle(position, radius, textInside, color) {
        this.context.beginPath();
        this.context.arc(position.getX(), position.getY(), radius, 0, Math.PI * 2);
        this.context.fillStyle = color || "#00f";
        this.context.fill();

        this.context.font = this.fontSize + 'pt Arial';
        this.context.fillStyle = '#fff';
        this.context.textAlign = 'center';
        this.context.fillText(textInside, position.getX(), position.getY() + this.fontSize / 2);
    }

    /**
     * @param {UndirectedEdge[]} edges
     */
    drawEdges(edges) {
        const generateShift = getShiftGenerator(edges.length);

        edges.forEach((edge) => {
            const vertices = edge.getVertices(),
                fromX = vertices[0].getPosition().getX(),
                fromY = vertices[0].getPosition().getY(),
                toX = vertices[1].getPosition().getX(),
                toY = vertices[1].getPosition().getY();

            this.context.beginPath();
            this.context.moveTo(fromX, fromY);
            let shiftX = (fromX + toX) / 2;
            let shiftY = (fromY + toY) / 2;
            shiftY += generateShift();
            this.context.quadraticCurveTo(shiftX, shiftY, toX, toY);
            this.context.stroke();

            if (edge instanceof DirectedEdge) {
                this.context.beginPath();
                const arrowStartPosition = new Position(
                    getQuadraticCurveCoord(this.ratio, fromX, shiftX, toX),
                    getQuadraticCurveCoord(this.ratio, fromY, shiftY, toY)
                );
                this.drawArrow(vertices[0].getPosition(), vertices[1].getPosition(), arrowStartPosition);
            }
        });
    }

    /**
     * https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%B2%D0%BE%D1%80%D0%BE%D1%82#.D0.9F.D0.BE.D0.B2.D0.BE.D1.80.D0.BE.D1.82_.D0.B2_.D0.B4.D0.B2.D1.83.D0.BC.D0.B5.D1.80.D0.BD.D0.BE.D0.BC_.D0.BF.D1.80.D0.BE.D1.81.D1.82.D1.80.D0.B0.D0.BD.D1.81.D1.82.D0.B2.D0.B5
     * @param {Position} fromPosition
     * @param {Position} toPosition
     * @param {Position} arrowStartPosition
     * @private
     */
    drawArrow(fromPosition, toPosition, arrowStartPosition) {
        const fromX = fromPosition.getX();
        const fromY = fromPosition.getY();
        const toX = toPosition.getX();
        const toY = toPosition.getY();

        const angle = Math.atan2(toY - fromY, toX - fromX);
        const rotationAngle = Math.PI / 6;

        const x = arrowStartPosition.getX();
        const y = arrowStartPosition.getY();

        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(
            x - this.arrowLength * Math.cos(angle - rotationAngle),
            y - this.arrowLength * Math.sin(angle - rotationAngle)
        );
        this.context.moveTo(x, y);
        this.context.lineTo(
            x - this.arrowLength * Math.cos(angle + rotationAngle),
            y - this.arrowLength * Math.sin(angle + rotationAngle)
        );
        this.context.stroke();
    }
}

/**
 * Calculates position of the point, that divides the line in a given ratio
 *
 * @param {number} ratio
 * @param {Position} fromPosition
 * @param {Position} toPosition
 * @return {Position}
 */
function getPositionDividedInRatio(ratio, fromPosition, toPosition) {
    return new Position(
        (fromPosition.getX() + (ratio * toPosition.getX())) / (1 + ratio),
        (fromPosition.getY() + (ratio * toPosition.getY())) / (1 + ratio)
    );
}

/**
 * https://ru.wikipedia.org/wiki/%D0%9A%D1%80%D0%B8%D0%B2%D0%B0%D1%8F_%D0%91%D0%B5%D0%B7%D1%8C%D0%B5#.D0.9A.D0.B2.D0.B0.D0.B4.D1.80.D0.B0.D1.82.D0.B8.D1.87.D0.BD.D1.8B.D0.B5_.D0.BA.D1.80.D0.B8.D0.B2.D1.8B.D0.B5
 * @param {number} t
 * @param {number} p0
 * @param {number} p1
 * @param {number} p2
 * @return {number}
 */
function getQuadraticCurveCoord(t, p0, p1, p2) {
    if (t < 0 || t > 1) {
        throw new Error('Parameter t must be in range from 0 to 1');
    }
    return Math.pow(1 - t, 2) * p0 + 2 * (1 - t) * t * p1 + Math.pow(t, 2) * p2;
}

/**
 * @param {number} edgesCount
 * @return {Function} Callback that generates shift for the next parallel edge
 */
function getShiftGenerator(edgesCount) {
    if (edgesCount < 1) {
        throw new Error('Edges count must be positive');
    }

    const distanceBetweenEdges = 50;
    let shift = (edgesCount % 2 === 0) ? distanceBetweenEdges : 0;

    return function () {
        const oldShift = shift;
        if (shift > 0) {
            shift *= -1;
        } else {
            shift = Math.abs(shift) + distanceBetweenEdges;
        }
        return oldShift;
    }
}

module.exports = CanvasHelper;
