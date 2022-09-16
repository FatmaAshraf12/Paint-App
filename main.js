let trackMouse = "", line, modeRes, erase, points = [], erasePoints = [], circleR
let strokeColor = document.querySelector('input#strokeColor')
let fillColor = document.querySelector('input#fillColor')
let svgChild = document.querySelector('#svg')
let svg = document.querySelector('#svg')

let createPoint = (element, x, y) => {
    let p = svg.createSVGPoint();
    p.x = x;
    p.y = y;
    return p.matrixTransform(element.getScreenCTM().inverse());
};

let mode = (value) => { modeRes = value }

window.onload = function () {
    let btns = document.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            if (document.querySelector(".activeBTN"))
                document.querySelector("button.activeBTN").classList.remove("activeBTN")
            this.classList.add("activeBTN");

        })
    }
}

/////////////// MOUSEDOWN EVENT
svg.onmousedown = function (e) {

    if (modeRes == "polyline") {
        polyline1 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        startPoly1 = createPoint(svg, e.clientX, e.clientY);
        points.push(startPoly1.x, startPoly1.y)
        drawPolyline(e);
    }

    else if (modeRes == "line") {
        line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        startLine = createPoint(svg, e.clientX, e.clientY);
        drawLine(e);
    }

    else if (modeRes == "erase") {
        erase = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        startErase = createPoint(svg, e.clientX, e.clientY);
        erasePoints.push(startErase.x, startErase.y)
        erase.setAttributeNS(null, "class", "erasex")
        drawErase(e);
    }

    else if (modeRes == "rect") {
        rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        start = createPoint(svg, e.clientX, e.clientY);
        drawRect(e);
    }
    else if (modeRes == "circle") {
        circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        startCircle = createPoint(svg, e.clientX, e.clientY);
        drawCircle(e);
    }

    trackMouse = true;
}


////////////// MOUSEMOVE EVENT
svg.onmousemove = function (e) {
    if (!trackMouse) return;

    if (modeRes == "line") drawLine(e)

    else if (modeRes == "polyline") drawPolyline(e)

    else if (modeRes == "erase") drawErase(e)

    else if (modeRes == "rect") drawRect(e);

    else if (modeRes == "circle") drawCircle(e)

}

////////////// MOUSEUP EVENT
svg.onmouseup = function (e) {
    if (modeRes == "line") saveLine();

    else if (modeRes == "polyline") savePolyline()

    else if (modeRes == "erase") saveErase()

    else if (modeRes == "rect") saveRect()

    else if (modeRes == "circle") saveCircle()

    if (!trackMouse) return;

    trackMouse = false;
}



/************************ LINE ********************************************************/
let drawLine = (e) => {

    let p0 = createPoint(svg, e.clientX, e.clientY);

    line.setAttributeNS(null, "x1", startLine.x)
    line.setAttributeNS(null, "y1", startLine.y)
    line.setAttributeNS(null, "x2", p0.x)
    line.setAttributeNS(null, "y2", p0.y)

    svg.appendChild(line);

}
let saveLine = () => {
    svg.removeEventListener('mousemove', drawLine);
    svg.removeEventListener('mouseup', saveLine);
}

/************************ RECTANGLE ********************************************************/
let drawRect = (e) => {
    let p = createPoint(svg, e.clientX, e.clientY);
    let w = Math.abs(p.x - start.x);
    let h = Math.abs(p.y - start.y);
    if (p.x > start.x) p.x = start.x;

    if (p.y > start.y) p.y = start.y;

    rect.setAttributeNS(null, 'x', p.x);
    rect.setAttributeNS(null, 'y', p.y);
    rect.setAttributeNS(null, 'width', w);
    rect.setAttributeNS(null, 'height', h);
    svg.appendChild(rect);
}


let saveRect = () => {
    svg.removeEventListener('mousemove', drawRect);
    svg.removeEventListener('mouseup', saveRect);
};

/************************ CIRCLE  **********************************************************/
let drawCircle = (e) => {
    let p1 = createPoint(svg, e.clientX, e.clientY);
    circleR = Math.abs(p1.x - startCircle.x)
    circle.setAttributeNS(null, "cx", p1.x);
    circle.setAttributeNS(null, "cy", p1.y);
    circle.setAttributeNS(null, "r", circleR);
    svg.appendChild(circle);
}

let saveCircle = () => {
    svg.removeEventListener('mousemove', drawCircle);
    svg.removeEventListener('mouseup', saveCircle);
}



/************************ POLYLINE  ***********************************************/
let drawPolyline = (e) => {
    let p2 = createPoint(svg, e.clientX, e.clientY);
    points.push(p2.x, p2.y)

    polyline1.setAttributeNS(null, "points", points)
    svg.appendChild(polyline1);
}

let savePolyline = () => {
    svg.removeEventListener('mousemove', drawPolyline);
    svg.removeEventListener('mouseup', savePolyline);
    points = []
}
/************************ ERASE  ***********************************************************/
let drawErase = (e) => {
    let p3 = createPoint(svg, e.clientX, e.clientY);
    erasePoints.push(p3.x, p3.y)
    erase.setAttributeNS(null, "points", erasePoints)
    svg.appendChild(erase);
}

let saveErase = () => {
    svg.removeEventListener('mousemove', drawErase);
    svg.removeEventListener('mouseup', saveErase);
    erasePoints = []
}


/************************* Change colors  *******************************/

let changeFillColor = () => {

    let children = svgChild.children

    for (let i = 0; i < children.length; i++)
        if (children[i] != "polyline.erasex")
            children[i].style.fill = fillColor.value

}

/*************************** CHANGE STROKE COLOR  ******************/

let changeStrokeColor = () => {

    let children = svgChild.children

    for (let i = 0; i < children.length; i++)
        if (children[i] != "polyline.erasex")
            children[i].style.stroke = strokeColor.value

}
