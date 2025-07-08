class HighwayAnimation {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.vehicles = [];
        this.vehicleId = 0;
        this.isPaused = false;
        
        // Animation properties
        this.roadOffset = 0;
        this.mountainOffset = 0;
        this.starOffset = 0;
        this.rainDrops = [];
        this.rainIntensity = 0.7;
        this.lightningTimer = 0;
        this.lightningAlpha = 0;
        this.lightningFrequency = 100; // More frequent lightning
        
        this.setupCanvas();
        this.createVehicleSprites();

        this.hideLoading();
        this.initializeRain();
        this.initializeClouds();
        this.gameLoop();
        this.setupEventListeners();
  
        this.initializeVehicles().then(() => {
            this.hideLoading();
            this.gameLoop();
        });
    
        
        // Check for pod count changes every 10 seconds
        setInterval(() => this.updateVehicleCount(), 10000);
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        this.canvas.style.display = 'block';
    }

    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.roadTop = this.canvas.height * 0.7;
        this.roadBottom = this.canvas.height * 0.95;
        this.roadHeight = this.roadBottom - this.roadTop;
        this.laneHeight = this.roadHeight / 3;
        
        this.lanes = [
            this.roadTop + this.laneHeight * 0.4,
            this.roadTop + this.laneHeight * 1.0,
            this.roadTop + this.laneHeight * 1.6
        ];
    }


    createVehicleSprites() {
        this.vehicleSprites = [];
        // const blueVariations = [
        //     '#1E90FF', '#00BFFF', '#4169E1', '#5252fa', 
        //     '#4682B4', '#63a4ff', '#191970'
        // ];

        const greenVariations = [
            '#3CB371', '#2E8B57', '#6B8E23', '#7CFC00',
            '#006400', '#9ACD32', '#6B8E23'
        ];

        // const redVariations = [
        //     '#DC143C', '#B22222', '#8B0000', '#FF6347',
        //     '#CD5C5C', '#F08080', '#FA8072'
        // ];

        const vehicleTypes = ['sedan', 'bus', 'truck', 'suv', 'hatchback', 'sports', 'doubleDecker'];
        
        for (let i = 0; i < 7; i++) {
            const type = vehicleTypes[i];
            // const color = blueVariations[i];
               const color = greenVariations[i];
            // const color = redVariations[i];
            const accent = this.darkenColor(color, 20);
            
            const canvas = document.createElement('canvas');
            let width, height;
            
            switch(type) {
                case 'bus': width = 120; height = 50; break;
                case 'truck': width = 150; height = 60; break;
                case 'suv': width = 100; height = 45; break;
                case 'hatchback': width = 85; height = 38; break;
                case 'sports': width = 95; height = 35; break;
                case 'doubleDecker': width = 110; height = 70; break;
                default: width = 90; height = 40; // sedan
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            this.drawVehicle(ctx, { type, color, accent, width, height });
            this.vehicleSprites.push(canvas);
        }
    }


    drawVehicle(ctx, design) {
        const { type, color, accent, width, height } = design;
        
        // Vehicle shadow
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(5, height - 2, width - 10, 4);
        
        // Main vehicle body
        ctx.fillStyle = color;
        
        switch(type) {
            case 'bus':
                // Regular bus
                ctx.fillRect(10, height - 35, width - 20, 30);
                // Windows
                ctx.fillStyle = 'rgba(135, 206, 235, 0.5)';
                for (let i = 0; i < 6; i++) {
                    ctx.fillRect(15 + i * 18, height - 30, 12, 10);
                }
                break;
                
            case 'doubleDecker':
                // Double-decker bus
                ctx.fillRect(10, height - 55, width - 20, 50);
                // Lower deck windows
                ctx.fillStyle = 'rgba(135, 206, 235, 0.5)';
                for (let i = 0; i < 5; i++) {
                    ctx.fillRect(15 + i * 18, height - 30, 12, 10);
                }
                // Upper deck windows
                for (let i = 0; i < 5; i++) {
                    ctx.fillRect(15 + i * 18, height - 50, 12, 10);
                }
                // Deck separator
                ctx.fillStyle = accent;
                ctx.fillRect(10, height - 35, width - 20, 3);
                break;
                
            case 'truck':
                // Truck with container
                ctx.fillRect(10, height - 30, width - 60, 25);
                ctx.fillRect(10, height - 45, 40, 15);
                ctx.fillStyle = accent;
                ctx.fillRect(50, height - 45, width - 60, 15);
                break;
                
            case 'suv':
                // SUV shape
                ctx.fillRect(10, height - 30, width - 20, 25);
                ctx.fillRect(20, height - 40, width - 40, 15);
                break;
                
            case 'hatchback':
                // Hatchback shape
                ctx.fillRect(10, height - 28, width - 20, 20);
                ctx.fillRect(20, height - 38, width - 40, 15);
                break;
                
            case 'sports':
                // Sports car shape
                ctx.beginPath();
                ctx.moveTo(10, height - 15);
                ctx.lineTo(30, height - 30);
                ctx.lineTo(width - 30, height - 30);
                ctx.lineTo(width - 10, height - 15);
                ctx.lineTo(width - 15, height - 5);
                ctx.lineTo(15, height - 5);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'bike':
                // Detailed bicycle
                // Frame
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                // Main triangle
                ctx.moveTo(width * 0.3, height - 5);
                ctx.lineTo(width * 0.5, height - 25);
                ctx.lineTo(width * 0.7, height - 5);
                // Seat post
                ctx.moveTo(width * 0.5, height - 25);
                ctx.lineTo(width * 0.55, height - 15);
                ctx.stroke();
                
                // Wheels
                ctx.beginPath();
                ctx.arc(width * 0.3, height - 5, 8, 0, Math.PI * 2);
                ctx.arc(width * 0.7, height - 5, 8, 0, Math.PI * 2);
                ctx.fill();
                
                // Seat
                ctx.fillStyle = accent;
                ctx.fillRect(width * 0.5, height - 30, 10, 5);
                
                // Handlebars
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(width * 0.5, height - 25);
                ctx.lineTo(width * 0.3, height - 20);
                ctx.moveTo(width * 0.5, height - 25);
                ctx.lineTo(width * 0.7, height - 20);
                ctx.stroke();
                return; // Skip common vehicle details for bike
                
            default: // sedan
                ctx.fillRect(10, height - 25, width - 20, 18);
                ctx.fillRect(25, height - 35, width - 50, 15);
        }
        
        // Common vehicle details (not for bike)
        if (type !== 'bike') {
            // Accent/trim
            ctx.fillStyle = accent;
            ctx.fillRect(10, height - 25, width - 20, 3);
            
            // Wheels
            ctx.fillStyle = '#2c3e50';
            ctx.beginPath();
            ctx.arc(25, height - 8, 7, 0, Math.PI * 2);
            ctx.arc(width - 25, height - 8, 7, 0, Math.PI * 2);
            ctx.fill();
            
            // Wheel rims
            ctx.fillStyle = '#7f8c8d';
            ctx.beginPath();
            ctx.arc(25, height - 8, 4, 0, Math.PI * 2);
            ctx.arc(width - 25, height - 8, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Lights
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(width - 15, height - 22, 6, 4);
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(8, height - 22, 4, 4);
        }
    }

    darkenColor(color, percent) {
        let r = parseInt(color.substring(1, 3), 16);
        let g = parseInt(color.substring(3, 5), 16);
        let b = parseInt(color.substring(5, 7), 16);

        r = Math.floor(r * (100 - percent) / 100);
        g = Math.floor(g * (100 - percent) / 100);
        b = Math.floor(b * (100 - percent) / 100);

        r = r.toString(16).padStart(2, '0');
        g = g.toString(16).padStart(2, '0');
        b = b.toString(16).padStart(2, '0');

        return `#${r}${g}${b}`;
    }

    async initializeVehicles() {
        const podCount = await this.fetchPodCount();
        this.vehicles = []; // Clear existing vehicles
        
        for (let i = 0; i < podCount; i++) {
            this.addNewVehicle(i * -200);
        }
    }

    // Add this method to periodically check for pod count changes
async updateVehicleCount() {
    const currentPodCount = await this.fetchPodCount();
    const currentVehicleCount = this.vehicles.length;
    
    if (currentPodCount !== currentVehicleCount) {
        // Adjust vehicle count
        if (currentPodCount > currentVehicleCount) {
            // Add vehicles
            for (let i = currentVehicleCount; i < currentPodCount; i++) {
                this.addNewVehicle();
            }
        } else {
            // Remove vehicles
            this.vehicles = this.vehicles.slice(0, currentPodCount);
        }
    }
}

    addNewVehicle(initialX = null) {
        const vehicle = {
            id: this.vehicleId++,
            x: initialX !== null ? initialX : -120 - Math.random() * 200,
            lane: Math.floor(Math.random() * this.lanes.length),
            speed: 1.5 + Math.random() * 3.5,
            sprite: Math.floor(Math.random() * this.vehicleSprites.length),
            width: this.vehicleSprites[0].width,
            height: this.vehicleSprites[0].height
        };
        
        vehicle.y = this.lanes[vehicle.lane];
        this.vehicles.push(vehicle);
    }

    updateVehicles() {
        this.vehicles.forEach(vehicle => {
            vehicle.x += vehicle.speed;
            
            if (vehicle.x > this.canvas.width + 120) {
                vehicle.x = -120 - Math.random() * 300;
                vehicle.lane = Math.floor(Math.random() * this.lanes.length);
                vehicle.y = this.lanes[vehicle.lane];
                vehicle.speed = 1.5 + Math.random() * 3.5;
                vehicle.sprite = Math.floor(Math.random() * this.vehicleSprites.length);
            }
        });
    }

    // drawVehicles() {
    //     this.vehicles.forEach(vehicle => {
    //         this.ctx.fillStyle = 'rgba(0,0,0,0.4)';
    //         this.ctx.fillRect(vehicle.x - vehicle.width/2, vehicle.y + 15, vehicle.width * 0.8, 8);
            
    //         this.ctx.drawImage(
    //             this.vehicleSprites[vehicle.sprite],
    //             vehicle.x - vehicle.width / 2,
    //             vehicle.y - vehicle.height / 2,
    //             vehicle.width,
    //             vehicle.height
    //         );
            
    //         // Rain on vehicle
    //         this.ctx.strokeStyle = 'rgba(200, 220, 255, 0.5)';
    //         this.ctx.lineWidth = 1;
    //         for (let i = 0; i < 3; i++) {
    //             const rx = vehicle.x - vehicle.width/2 + Math.random() * vehicle.width;
    //             const ry = vehicle.y - vehicle.height/2 + Math.random() * vehicle.height/2;
    //             this.ctx.beginPath();
    //             this.ctx.moveTo(rx, ry);
    //             this.ctx.lineTo(rx - 5, ry + 10);
    //             this.ctx.stroke();
    //         }
    //     });
    // }
    // Add cloud drawing and updating
    
    async fetchPodCount() {
        try {
            const response = await fetch('/api/pod-info');
            const data = await response.json();
            return data.podCount;
        } catch (error) {
            console.error('Failed to fetch pod count:', error);
            return 1; // Default to 1 vehicle
        }
    }
    
    drawVehicles() {
        this.vehicles.forEach((vehicle, index) => {
            // Vehicle shadow
            this.ctx.fillStyle = 'rgba(0,0,0,0.4)';
            this.ctx.fillRect(vehicle.x - vehicle.width/2, vehicle.y + 15, vehicle.width * 0.8, 8);
            
            // Draw vehicle sprite
            this.ctx.drawImage(
                this.vehicleSprites[vehicle.sprite],
                vehicle.x - vehicle.width / 2,
                vehicle.y - vehicle.height / 2,
                vehicle.width,
                vehicle.height
            );
            
            // Draw vehicle number (1, 2, 3...)
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                (index + 1).toString(),
                vehicle.x,
                vehicle.y + 5
            );
            
            // Rain on vehicle
            this.ctx.strokeStyle = 'rgba(200, 220, 255, 0.5)';
            this.ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                const rx = vehicle.x - vehicle.width/2 + Math.random() * vehicle.width;
                const ry = vehicle.y - vehicle.height/2 + Math.random() * vehicle.height/2;
                this.ctx.beginPath();
                this.ctx.moveTo(rx, ry);
                this.ctx.lineTo(rx - 5, ry + 10);
                this.ctx.stroke();
            }
        });
    }
    
    initializeClouds() {
        this.clouds = [];
        for (let i = 0; i < 8; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width * 2,
                y: Math.random() * this.canvas.height * 0.4,
                size: 50 + Math.random() * 80,
                speed: 0.2 + Math.random() * 0.5
            });
        }
    }

    updateClouds() {
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.speed;
            if (cloud.x < -cloud.size * 2) {
                cloud.x = this.canvas.width + cloud.size * 2;
                cloud.y = Math.random() * this.canvas.height * 0.4;
            }
        });
    }

    drawClouds() {
        this.ctx.fillStyle = 'rgba(80, 80, 100, 0.7)';
        this.clouds.forEach(cloud => {
            this.drawCloud(cloud.x, cloud.y, cloud.size);
            this.drawCloud(cloud.x + cloud.size * 0.6, cloud.y - cloud.size * 0.2, cloud.size * 0.7);
            this.drawCloud(cloud.x + cloud.size * 0.3, cloud.y + cloud.size * 0.1, cloud.size * 0.5);
        });
    }       
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height * 0.65);
        gradient.addColorStop(0, '#080810');
        gradient.addColorStop(0.3, '#101018');
        gradient.addColorStop(0.7, '#0c0c14');
        gradient.addColorStop(1, '#181824');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.65);


     ///******************* daytime sun code starts here *******************//    
        // // Bright sun
        // const sunX = this.canvas.width * 0.8;
        // const sunY = this.canvas.height * 0.2;
        
        // // Sun glow/rays
        // const sunGlow = this.ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 80);
        // sunGlow.addColorStop(0, 'rgba(255, 255, 100, 0.6)');
        // sunGlow.addColorStop(0.5, 'rgba(255, 200, 50, 0.3)');
        // sunGlow.addColorStop(1, 'transparent');
        // this.ctx.fillStyle = sunGlow;
        // this.ctx.fillRect(sunX - 80, sunY - 80, 160, 160);
        
        // // Sun rays
        // this.ctx.strokeStyle = 'rgba(255, 255, 100, 0.4)';
        // this.ctx.lineWidth = 2;
        // for (let i = 0; i < 8; i++) {
        //     const angle = (i * Math.PI * 2) / 8;
        //     const x1 = sunX + Math.cos(angle) * 35;
        //     const y1 = sunY + Math.sin(angle) * 35;
        //     const x2 = sunX + Math.cos(angle) * 55;
        //     const y2 = sunY + Math.sin(angle) * 55;
            
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(x1, y1);
        //     this.ctx.lineTo(x2, y2);
        //     this.ctx.stroke();
        // }
        
        // // Sun itself
        // this.ctx.fillStyle = '#FFD700';
        // this.ctx.beginPath();
        // this.ctx.arc(sunX, sunY, 25, 0, Math.PI * 2);
        // this.ctx.fill();
        
        // // Sun highlights
        // this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        // this.ctx.beginPath();
        // this.ctx.arc(sunX - 8, sunY - 8, 8, 0, Math.PI * 2);
        // this.ctx.fill();

    ///******************* daytime sun code ends here *******************//

   ///******************* nighttime moon code starts here *******************//
        const moonX = this.canvas.width * 0.8;
        const moonY = this.canvas.height * 0.2;
        // Blue moon effect (only visible sometimes)
        if (Math.random() < 0.1) { // 10% chance to appear (once in a blue moon)
            const moonX = this.canvas.width * 0.8;
            const moonY = this.canvas.height * 0.2;
            
            // Blue moon glow
            const moonGlow = this.ctx.createRadialGradient(
                moonX, moonY, 20, moonX, moonY, 60
            );
            moonGlow.addColorStop(0, 'rgba(100, 100, 255, 0.4)');
            moonGlow.addColorStop(1, 'transparent');
            this.ctx.fillStyle = moonGlow;
            this.ctx.fillRect(moonX - 60, moonY - 60, 120, 120);
            
            // Blue moon itself
            this.ctx.fillStyle = '#6666FF';
            this.ctx.beginPath();
            this.ctx.arc(moonX, moonY, 25, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Moon craters
            this.ctx.fillStyle = 'rgba(80, 80, 200, 0.5)';
            this.ctx.beginPath();
            this.ctx.arc(moonX - 10, moonY - 8, 6, 0, Math.PI * 2);
            this.ctx.arc(moonX + 8, moonY + 5, 4, 0, Math.PI * 2);
            this.ctx.fill();
        }
        // Moon glow through clouds
        const moonGlow = this.ctx.createRadialGradient(moonX, moonY, 20, moonX, moonY, 60);
        moonGlow.addColorStop(0, 'rgba(200, 200, 220, 0.3)');
        moonGlow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = moonGlow;
        this.ctx.fillRect(moonX - 60, moonY - 60, 120, 120);
        
        // Moon itself (cloudy)
        this.ctx.fillStyle = 'rgba(220, 220, 240, 0.5)';
        this.ctx.beginPath();
        this.ctx.arc(moonX, moonY, 25, 0, Math.PI * 2);
        this.ctx.fill();
   ///******************* nighttime moon code end's here *******************//

    }

    drawCloud(x, y, size) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.5, y - size * 0.2, size * 0.5, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.8, y + size * 0.1, size * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawMountains() {
        const layers = [
            { offset: this.mountainOffset * 0.2, color: '#080810', height: 0.55 },
            { offset: this.mountainOffset * 0.4, color: '#101018', height: 0.60 },
            { offset: this.mountainOffset * 0.6, color: '#181824', height: 0.65 }
        ];
        
        layers.forEach(layer => {
            this.ctx.fillStyle = layer.color;
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.canvas.height * layer.height);
            
            for (let x = 0; x <= this.canvas.width + 50; x += 15) {
                const height = this.canvas.height * layer.height + 
                              Math.sin((x + layer.offset) * 0.005) * 120 + 
                              Math.sin((x + layer.offset) * 0.015) * 60 +
                              Math.sin((x + layer.offset) * 0.03) * 30;
                this.ctx.lineTo(x, height);
            }
            
            this.ctx.lineTo(this.canvas.width, this.canvas.height);
            this.ctx.lineTo(0, this.canvas.height);
            this.ctx.fill();
        });
        
        this.mountainOffset += 0.3;
    }

  

    drawTrees() {
        const treeCount = Math.floor(this.canvas.width / 80) + 2;
        
        for (let i = 0; i < treeCount; i++) {
            const baseX = i * 80 + 50;
            const x = (baseX + this.mountainOffset * 0.8) % (this.canvas.width + 200) - 100;
            const baseY = this.roadTop - 5;
            
            if (x > -50 && x < this.canvas.width + 50) {
                const treeType = i % 3; // 3 different tree styles
                
                // Draw trunk
                this.ctx.fillStyle = '#5D4037'; // Brown trunk
                const trunkWidth = 8 + treeType * 2;
                const trunkHeight = 30 + treeType * 10;
                this.ctx.fillRect(x - trunkWidth/2, baseY - trunkHeight, trunkWidth, trunkHeight);
                
                // Draw foliage based on tree type
                switch(treeType) {
                    case 0: // Pine tree
                        this.ctx.fillStyle = '#2E7D32';
                        this.ctx.beginPath();
                        this.ctx.moveTo(x, baseY - trunkHeight - 30);
                        this.ctx.lineTo(x - 20, baseY - trunkHeight);
                        this.ctx.lineTo(x + 20, baseY - trunkHeight);
                        this.ctx.closePath();
                        this.ctx.fill();
                        break;
                        
                    case 1: // Round deciduous
                        this.ctx.fillStyle = '#8BC34A';
                        this.ctx.beginPath();
                        this.ctx.arc(x, baseY - trunkHeight - 15, 25, 0, Math.PI * 2);
                        this.ctx.fill();
                        break;
                        
                    case 2: // Bushy tree
                        this.ctx.fillStyle = '#4CAF50';
                        this.ctx.beginPath();
                        // Main canopy
                        this.ctx.arc(x, baseY - trunkHeight - 20, 20, 0, Math.PI * 2);
                        // Side clusters
                        this.ctx.arc(x - 15, baseY - trunkHeight - 10, 15, 0, Math.PI * 2);
                        this.ctx.arc(x + 15, baseY - trunkHeight - 10, 15, 0, Math.PI * 2);
                        this.ctx.fill();
                        break;
                }
            }
        }
    }


    initializeRain() {
        this.rainDrops = [];
        for (let i = 0; i < 1000; i++) { // Increased number of drops
            this.rainDrops.push({
                x: Math.random() * this.canvas.width * 1.5,
                y: Math.random() * this.canvas.height * 1.5,
                length: 10 + Math.random() * 10, // Longer streaks
                speed: 8 + Math.random() * 4, // Faster movement
                opacity: 0.4 + Math.random() * 0.3, // Better visibility
                sway: Math.random() * 0.5 // Gentle side-to-side movement
            });
        }
    }

    updateRain() {
        for (let i = 0; i < this.rainDrops.length; i++) {
            const drop = this.rainDrops[i];
            drop.y += drop.speed;
            drop.x += drop.sway;
            
            if (drop.y > this.canvas.height * 1.5) {
                drop.y = -20;
                drop.x = Math.random() * this.canvas.width * 1.5;
            }
            if (drop.x > this.canvas.width * 1.5) {
                drop.x = 0;
            }
        }
    }

    drawRain() {
        // Draw rain streaks with anti-aliasing effect
        for (const drop of this.rainDrops) {
            const gradient = this.ctx.createLinearGradient(
                drop.x, drop.y, 
                drop.x - drop.length * 0.3, drop.y + drop.length
            );
            gradient.addColorStop(0, `rgba(180, 200, 255, ${drop.opacity})`);
            gradient.addColorStop(1, `rgba(180, 200, 255, 0)`);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x - drop.length * 0.3, drop.y + drop.length);
            this.ctx.stroke();
        }
    }

    updateLightning() {
        if (this.lightningTimer <= 0) {
            if (Math.random() < 0.02) { // More frequent lightning (about 2 every 10 seconds)
                this.lightningTimer = this.lightningFrequency;
                this.lightningAlpha = 0.8;
            }
        } else {
            this.lightningTimer--;
            this.lightningAlpha = Math.max(0, this.lightningAlpha - 0.03);
        }
    }

    drawLightning() {
        if (this.lightningAlpha > 0) {
            // Flash effect
            this.ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningAlpha})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            if (this.lightningAlpha > 0.4) {
                // Lightning bolt
                const startX = Math.random() * this.canvas.width * 0.7 + this.canvas.width * 0.15;
                const startY = 30;
                const endX = startX + (Math.random() - 0.5) * 100;
                const endY = 150;
                
                this.ctx.strokeStyle = `rgba(200, 220, 255, ${this.lightningAlpha * 0.8})`;
                this.ctx.lineWidth = 2 + Math.random() * 3;
                this.ctx.beginPath();
                this.ctx.moveTo(startX, startY);
                
                let x = startX, y = startY;
                while (y < endY) {
                    x += (Math.random() - 0.5) * 40;
                    y += 5 + Math.random() * 15;
                    this.ctx.lineTo(x, y);
                }
                
                this.ctx.stroke();
                
                // Lightning branches
                for (let i = 0; i < 3; i++) {
                    const branchX = startX + (Math.random() - 0.5) * 80;
                    const branchY = startY + Math.random() * 100;
                    this.ctx.beginPath();
                    this.ctx.moveTo(branchX, branchY);
                    this.ctx.lineTo(branchX + (Math.random() - 0.5) * 30, branchY + 20 + Math.random() * 30);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawRoad() {
        // Wet road surface
        const roadGradient = this.ctx.createLinearGradient(0, this.roadTop, 0, this.roadBottom);
        roadGradient.addColorStop(0, '#282828');
        roadGradient.addColorStop(0.3, '#202020');
        roadGradient.addColorStop(0.7, '#181818');
        roadGradient.addColorStop(1, '#101010');
        
        this.ctx.fillStyle = roadGradient;
        this.ctx.fillRect(0, this.roadTop, this.canvas.width, this.roadHeight);
        
        // Road markers/signs
        this.drawRoadMarkers();
        
        // Road edges
        this.ctx.fillStyle = '#444';
        this.ctx.fillRect(0, this.roadTop - 4, this.canvas.width, 4);
        this.ctx.fillRect(0, this.roadBottom, this.canvas.width, 4);
        
        // Lane markings
        this.ctx.strokeStyle = 'rgba(255, 221, 0, 0.7)';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([40, 25]);
        this.ctx.lineDashOffset = -this.roadOffset;
        
        for (let i = 1; i < this.lanes.length; i++) {
            const y = this.roadTop + (i * this.laneHeight) - this.laneHeight * 0.1;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        this.roadOffset += 3;
    }

    drawRoadMarkers() {
        const markerTypes = [
            { 
                text: ['EXIT', '2 MILES'], 
                color: '#2ecc71', 
                width: 100, 
                height: 40,
                textSize: 10  // Reduced text size
            },
            { 
                text: ['SPEED', 'LIMIT 65'], 
                color: '#e74c3c', 
                width: 100, 
                height: 50,
                textSize: 10
            },
            { 
                text: ['NEXT', 'SERVICE'], 
                color: '#3498db', 
                width: 100, 
                height: 40,
                textSize: 10
            }
        ];
        
        const spacing = this.canvas.width / 1.5;
        
        for (let i = 0; i < 4; i++) {
            const baseX = i * spacing + 100;
            const x = (baseX - this.roadOffset * 0.8) % (this.canvas.width + 400) - 200;
            const y = this.roadTop - 70;
            
            if (x > -200 && x < this.canvas.width + 200) {
                const marker = markerTypes[i % markerTypes.length];
                const textLines = marker.text;
                const lineHeight = 12;  // Reduced line height
                const startY = y + 15;  // Adjusted vertical position
                
                // Sign post
                this.ctx.fillStyle = '#7f8c8d';
                this.ctx.fillRect(x - 3, y + 20, 6, this.roadTop - y - 20);
                
                // Sign board with rounded corners
                this.ctx.fillStyle = marker.color;
                this.roundRect(x - marker.width/2, y, marker.width, marker.height, 5);
                this.ctx.fill();
                
                // Sign border
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // Sign text
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = `bold ${marker.textSize}px Arial`;
                this.ctx.textAlign = 'center';
                
                textLines.forEach((line, idx) => {
                    // Ensure text fits within marker
                    const maxWidth = marker.width - 10;
                    const metrics = this.ctx.measureText(line);
                    if (metrics.width > maxWidth) {
                        this.ctx.font = `bold ${marker.textSize-2}px Arial`;
                    }
                    this.ctx.fillText(line, x, startY + (idx * lineHeight));
                    this.ctx.font = `bold ${marker.textSize}px Arial`;
                });
            }
        }
    }
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    gameLoop(currentTime = 0) {
        if (!this.isPaused) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.drawBackground();
            this.updateClouds();
            this.drawClouds();
            this.drawMountains();
            this.updateLightning();
            this.drawLightning();
            this.drawTrees();
            this.drawRoad();
            this.updateRain();
            this.drawRain();
            this.updateVehicles();
            this.drawVehicles();
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePause();
            }
        });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    }

    resetAnimation() {
        this.vehicles = [];
        this.vehicleId = 0;
        this.initializeVehicles();
    }
}

// Global functions
function togglePause() {
    if (window.highwayAnimation) {
        window.highwayAnimation.togglePause();
    }
}

function resetAnimation() {
    if (window.highwayAnimation) {
        window.highwayAnimation.resetAnimation();
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        window.highwayAnimation = new HighwayAnimation();
    }, 500);
});