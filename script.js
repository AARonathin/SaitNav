document.addEventListener("DOMContentLoaded", () => {
    const buildingSelect = document.getElementById("building");
    const floorSelect = document.getElementById("floor");
    const entranceSelect = document.getElementById("entrance");
    const roomSelect = document.getElementById("room");
    const floorplanImg = document.getElementById("floorplan");
    const findPathBtn = document.getElementById("findPath");
    const mapContainer = document.querySelector(".map-container");
    const googleMap = document.getElementById("googleMap");


    let graphContainer = document.createElement("div");
    graphContainer.id = "graph";
    graphContainer.style.position = "absolute";
    graphContainer.style.top = "0";
    graphContainer.style.left = "0";
    graphContainer.style.width = "100%";
    graphContainer.style.height = "100%";
    graphContainer.style.pointerEvents = "none";
    mapContainer.appendChild(graphContainer);

    let isDragging = false, startX, startY, currentX = 0, currentY = 0;
    let scale = 1, minScale = 1;

    floorplanImg.ondragstart = () => false;

    function updateImageSize() {
        if (!floorplanImg.naturalWidth || !floorplanImg.naturalHeight) return;

        const viewportHeight = window.innerHeight;
        const imageAspectRatio = floorplanImg.naturalWidth / floorplanImg.naturalHeight;

        floorplanImg.style.height = `${viewportHeight}px`;
        floorplanImg.style.width = `${viewportHeight * imageAspectRatio}px`;

        minScale = viewportHeight / floorplanImg.naturalHeight;
        scale = Math.max(scale, minScale);
        applyTransform();
    }

    function applyTransform() {
        mapContainer.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    }

    function startDrag(e) {
        isDragging = true;
        startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        startY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
        mapContainer.style.cursor = "grabbing";
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        const y = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

        const dx = x - startX;
        const dy = y - startY;

        currentX += dx;
        currentY += dy;

        applyTransform();
        startX = x;
        startY = y;
    }

    function stopDrag() {
        isDragging = false;
        mapContainer.style.cursor = "grab";
    }

    mapContainer.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);

    mapContainer.addEventListener("touchstart", startDrag);
    document.addEventListener("touchmove", drag);
    document.addEventListener("touchend", stopDrag);

    mapContainer.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomFactor = 1.1;
        const scaleMultiplier = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
    
        const newScale = scale * scaleMultiplier;
        if (newScale >= minScale && newScale <= 3) { 
            scale = newScale;
            applyTransform();
        }
    });
    
    

    const buildingImages = {
        "building1": {
            "floor1": "Stan_Grad/stangradfloor1.png",
            "floor2": "Stan_Grad/stangradfloor2.png",
            "floor3": "Stan_Grad/stangradfloor3.png",
            "Basement": "Stan_Grad/stangradbasement.png"
        },
        "building2": {
            "floor1": "Senator_Burns/Senator_Burns_Floor_1.png",
            "floor2": "Senator_Burns/Senator_Burns_Floor_2.png",
            "floor3": "Senator_Burns/Senator_Burns_Floor_3.png",
            "floor5": "Senator_Burns/Senator_Burns_Floor_5.png",
            "floor6": "Senator_Burns/Senator_Burns_Floor_6.png",
            "floor7": "Senator_Burns/Senator_Burns_Floor_7.png",
            "floor8": "Senator_Burns/Senator_Burns_Floor_8.png",
            "floor9": "Senator_Burns/Senator_Burns_Floor_9.png",
            "floor10": "Senator_Burns/Senator_Burns_Floor_10.png",
            "floor11": "Senator_Burns/Senator_Burns_Floor_11.png",
        }
    };

    const entrances = {
        "building1": {
            "floor1": [
                { id: "E1", label: "West Blue Entrance" },
                { id: "E3", label: "North Blue Entrance" },
                { id: "E2", label: "East Blue Entrance" }
            ],
            "floor2": [
                { id: "E3", label: "East Blue Entrance" }
            ]
        }
    };
    
    const rooms = {
        "building1": {
            "floor1": [
                { id: "R101", label: "B 101" },
                { id: "R102", label: "B 102" },
                { id: "R103", label: "B 103" },
                { id: "R104", label: "B 104" },
                { id: "R105", label: "B 105" },
                { id: "R106", label: "B 106" },
                { id: "R107", label: "B 107" },
                { id: "R108", label: "B 108" },
                { id: "R109", label: "B 109" },
                { id: "R110", label: "B 110" },
                { id: "R111", label: "B 111" },
                { id: "R112", label: "B 112" },
                { id: "R113", label: "B 113" },
                { id: "R114", label: "B 114" },
                { id: "R115", label: "B 115" },
                { id: "R116", label: "B 116" },
                { id: "R117", label: "B 117" },
                { id: "R118", label: "B 118" },
                { id: "R119", label: "B 119" },
            ],
            "floor2": [
                { id: "R201", label: "Room 201" },
                { id: "R202", label: "Room 202" }
            ]
        }
    };
    const graphData = {
        "building1": {
            "floor1": {
                nodes: [
                    { id: "E1", label: "West Blue Entrance", pos: { x: 69, y: 293 }, type: "entrance" },
                    { id: "E2", label: "East Blue Entrance", pos: { x: 414, y: 396 }, type: "entrance" },
                    { id: "E3", label: "North Blue Entrance", pos: { x: 362, y: 169 }, type: "entrance" },
                    { id: "R101", label: "B 101", pos: { x: 100, y: 279 } },
                    { id: "R102", label: "B 102", pos: { x: 121, y: 302 } },
                    { id: "R103", label: "B 103", pos: { x: 151, y: 301 } },
                    { id: "R104", label: "B 104", pos: { x: 164, y: 301 } },
                    { id: "R105", label: "B 105", pos: { x: 200, y: 277 } },
                    { id: "R106", label: "B 106", pos: { x: 200, y: 306 } },
                    { id: "R107", label: "B 107", pos: { x: 217, y: 278 } },
                    { id: "R108", label: "B 108", pos: { x: 271, y: 311 } },
                    { id: "R109", label: "B 109", pos: { x: 271, y: 333 } },
                    { id: "R110", label: "B 110", pos: { x: 271, y: 375 } },
                    { id: "R111", label: "B 111", pos: { x: 297, y: 389 } },
                    { id: "R112", label: "B 112", pos: { x: 364, y: 414 } },
                    { id: "R113", label: "B 113", pos: { x: 310, y: 301 } },
                    { id: "R114", label: "B 114", pos: { x: 312, y: 282 } },
                    { id: "R115", label: "B 115", pos: { x: 339, y: 309 } },
                    { id: "R116", label: "B 116", pos: { x: 369, y: 282 } },
                    { id: "R117", label: "B 117", pos: { x: 395, y: 328 } },
                    { id: "R118", label: "B 118", pos: { x: 390, y: 360 } },
                    { id: "R119", label: "B 119", pos: { x: 390, y: 379 } },
                    { id: "I1", label: "Intersection 1", type: "intersection", pos: { x: 100, y: 293 } },
                    { id: "I2", label: "Intersection 2", type: "intersection", pos: { x: 121, y: 293 } },
                    { id: "I3", label: "Intersection 3", type: "intersection", pos: { x: 151, y: 293 } },
                    { id: "I4", label: "Intersection 4", type: "intersection", pos: { x: 164, y: 293 } },
                    { id: "I5", label: "Intersection 5", type: "intersection", pos: { x: 200, y: 293 } },
                    { id: "I6", label: "Intersection 6", type: "intersection", pos: { x: 217, y: 293 } },
                    { id: "I7", label: "Intersection 7", type: "intersection", pos: { x: 310, y: 293 } },
                    { id: "I8", label: "Intersection 8", type: "intersection", pos: { x: 369, y: 293 } },
                    { id: "I9", label: "Intersection 9", type: "intersection", pos: { x: 404, y: 293 } },
                    { id: "I10", label: "Intersection 10", type: "intersection", pos: { x: 404, y: 328 } },
                    { id: "I11", label: "Intersection 11", type: "intersection", pos: { x: 404, y: 360 } },
                    { id: "I12", label: "Intersection 12", type: "intersection", pos: { x: 404, y: 379 } },
                    { id: "I13", label: "Intersection 13", type: "intersection", pos: { x: 404, y: 396 } },
                    { id: "I14", label: "Intersection 14", type: "intersection", pos: { x: 404, y: 194 } },
                    { id: "I15", label: "Intersection 15", type: "intersection", pos: { x: 363, y: 194 } },
                    { id: "I16", label: "Intersection 16", type: "intersection", pos: { x: 100, y: 293 } },
                    { id: "I17", label: "Intersection 17", type: "intersection", pos: { x: 100, y: 293 } },
                    { id: "I18", label: "Intersection 18", type: "intersection", pos: { x: 100, y: 293 } },
                    { id: "I19", label: "Intersection 19", type: "intersection", pos: { x: 100, y: 293 } },
                    { id: "I20", label: "Intersection 20", type: "intersection", pos: { x: 100, y: 293 } },
                    { id: "I21", label: "Intersection 21", type: "intersection", pos: { x: 200, y: 311 } },
                ],
                edges: [
                    { source: "E1", target: "I1" },
                    { source: "I1", target: "I2" },
                    { source: "I2", target: "I3" },
                    { source: "I3", target: "I4" },
                    { source: "I4", target: "I5" },
                    { source: "I5", target: "I6" },
                    { source: "I6", target: "I7" },
                    { source: "I7", target: "I8" },
                    { source: "I8", target: "I9" },
                    { source: "I1", target: "R101" },
                    { source: "I2", target: "R102" },
                    { source: "I3", target: "R103" },
                    { source: "I4", target: "R104" },
                    { source: "I5", target: "R105" },
                    { source: "I5", target: "R106" },
                    { source: "I6", target: "R107" },
                    { source: "I7", target: "R113" },
                    { source: "I7", target: "R114" },
                    { source: "I8", target: "R116" },
                    { source: "I5", target: "I21" },
                    { source: "I21", target: "R108" },
                    { source: "I21", target: "R109" },
                    { source: "I21", target: "R110" },
                    { source: "R110", target: "R111" },
                    { source: "R111", target: "R112" },
                    { source: "I9", target: "I10" },
                    { source: "I10", target: "R117" },
                    { source: "I10", target: "I11" },
                    { source: "I11", target: "R118" },
                    { source: "I11", target: "I12" },
                    { source: "I12", target: "R119" },
                    { source: "I12", target: "I13" },
                    { source: "I13", target: "E2" },
                    { source: "E2", target: "I13" },
                    { source: "E3", target: "I15" },
                    { source: "I15", target: "I14" },
                    { source: "I14", target: "I9" },
                ]
            },
            "floor2": {
                nodes: [
                    { id: "E3", label: "North Blue Entrance", pos: { x: 200, y: 60 }, type: "entrance" },
                    { id: "R201", label: "Room 201", pos: { x: 500, y: 700 } }
                ],
                edges: [
                    { source: "E3", target: "R201" }
                ]
            }
        }
    };

    let cy = cytoscape({
        container: graphContainer,
        style: [
            {
              selector: 'node',
              style: {
                'background-color': '#ffffff',
                'label': '', // No label displayed
                'font-size': '10px',
                'shape': 'ellipse',
                'width': '5px',
                'height': '5px'
              }
            },
            {
              selector: "node[type='intersection']",
              style: {
                'label': '', // Ensure intersections also have no label
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 2,
                'line-color': '#ffffff'
              }
            },
            {
              selector: '.hidden',
              style: {
                'display': 'none'
              }
            }
          ]
          
          
    });

  
    function updateGraph(selectedBuilding, selectedFloor) {
        if (!selectedBuilding || !selectedFloor) return;
    
        const data = graphData[selectedBuilding][selectedFloor];
        if (!data) return;
    
        const originalWidth = 1080;
        const originalHeight = 1080;
        const displayedWidth = floorplanImg.clientWidth;
        const displayedHeight = floorplanImg.clientHeight;
    
        const scaleX = displayedWidth / originalWidth;
        const scaleY = displayedHeight / originalHeight;
    
        cy.elements().remove();
    
        const nodes = data.nodes.map(n => ({
            data: { id: n.id, label: n.label, type: n.type || "" },
            position: {
                x: n.pos.x * scaleX,
                y: n.pos.y * scaleY
            },
            classes: (n.type !== "entrance" ? "hidden" : "")
        }));
    
        const edges = data.edges.map(e => ({
            data: { source: e.source, target: e.target },
            classes: "hidden"
        }));
    
        cy.add(nodes);
        cy.add(edges);
    }
    
    

    function updateCanvasSize() {
        updateImageSize();
        updateGraph(buildingSelect.value, floorSelect.value);
    }

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(document.body);

    buildingSelect.addEventListener("change", () => {
        const selectedBuilding = buildingSelect.value;
    
        floorSelect.innerHTML = '<option value="">-- Select Floor --</option>';
    
        if (selectedBuilding && buildingImages[selectedBuilding]) {
            Object.keys(buildingImages[selectedBuilding]).forEach(floor => {
                const option = document.createElement("option");
                option.value = floor;
                option.textContent = floor;
                floorSelect.appendChild(option);
            });
            floorSelect.disabled = false;
        } else {
            floorSelect.disabled = true;
        }
    
        // Reset UI
        googleMap.style.display = "block";
        floorplanImg.style.display = "none";
        cy.elements().remove();
    
        entranceSelect.disabled = true;
        roomSelect.disabled = true;
    });
    

    floorSelect.addEventListener("change", () => {
        const selectedBuilding = buildingSelect.value;
        const selectedFloor = floorSelect.value;
    
        if (selectedBuilding && selectedFloor) {
            // Hide the map, show the floorplan
            googleMap.style.display = "none";
            floorplanImg.style.display = "block";
    
            floorplanImg.src = buildingImages[selectedBuilding][selectedFloor];
    
            setTimeout(() => {
                updateImageSize();
                updateGraph(selectedBuilding, selectedFloor);
            }, 200);
    
            // Populate and enable dropdowns
            updateDropdown(entranceSelect, entrances[selectedBuilding][selectedFloor] || []);
            updateDropdown(roomSelect, rooms[selectedBuilding][selectedFloor] || []);
    
        } else {
            // No floor selected = show map, hide everything else
            googleMap.style.display = "block";
            floorplanImg.style.display = "none";
            cy.elements().remove();
    
            // Disable dropdowns
            entranceSelect.disabled = true;
            roomSelect.disabled = true;
        }
    });
    

    function updateDropdown(dropdown, options) {
        dropdown.innerHTML = '<option value="">-- Select --</option>';
        options.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt.id;   // Internal value used by the application
            option.textContent = opt.label; // User-friendly label displayed in the dropdown
            dropdown.appendChild(option);
        });
        dropdown.disabled = options.length === 0;
    }
    

    findPathBtn.addEventListener("click", () => {
        const start = entranceSelect.value;
        const end = roomSelect.value;
    
        if (!start || !end) {
            alert("Please select both an entrance and a room.");
            return;
        }
    
        // Hide everything first
        cy.elements().addClass('hidden');
    
        // Always show entrance nodes
        cy.nodes().forEach(n => {
            if (n.data('type') === 'entrance') n.removeClass('hidden');
        });
    
        // Dijkstra path
        const dijkstra = cy.elements().dijkstra(`#${start}`, () => 1, false);
        const pathToTarget = dijkstra.pathTo(cy.$(`#${end}`));
    
        if (pathToTarget.length > 0) {
            pathToTarget.removeClass('hidden');
            pathToTarget.style({
                "line-color": "#ffffff",
                "width": 3,
                "background-color": "ffffff"
            });
    
            console.log("✅ Highlighted Path:", pathToTarget.map(el => el.id()));
        } else {
            alert("No valid path found!");
        }
    });
    
    document.getElementById('toggleSidebar').addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
    });
    
    window.addEventListener("resize", updateCanvasSize);
});

