/**
 * sections.js — Obsidian Coffee (Adapted for Coffee_3)
 * Three.js Instanced Mesh Bean Universe + Section Animations
 */

/* ======================================================
   WAIT FOR DOM + LIBRARIES
   ====================================================== */
document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================
       1. THREE.JS INSTANCED MESH BEAN UNIVERSE
       ====================================================== */
    const initBeanUniverse = () => {
        const section = document.getElementById('bean-universe');
        if (!section) return;

        // ---- Canvas Setup ----
        const canvas = document.getElementById('bean-canvas');
        if (!canvas) return;

        // Position the bean canvas to cover the bean-universe section
        const updateCanvasPosition = () => {
            const rect = section.getBoundingClientRect();
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            canvas.style.position = 'absolute';
            canvas.style.top = (rect.top + scrollY) + 'px';
            canvas.style.left = '0';
            canvas.style.width = '100vw';
            canvas.style.height = section.offsetHeight + 'px';
            canvas.style.zIndex = '5';
            canvas.style.pointerEvents = 'none';
        };
        updateCanvasPosition();

        // Override: make section relative, canvas inside it
        section.style.position = 'relative';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '1';
        canvas.style.pointerEvents = 'auto'; // allow mouse interaction on canvas

        // Move canvas inside section
        section.appendChild(canvas);

        // ---- Three.js Scene ----
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#030303');
        scene.fog = new THREE.FogExp2('#030303', 0.035);

        const W = section.offsetWidth;
        const H = section.offsetHeight;

        const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
        camera.position.set(0, 0, 28);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;

        // ---- Lighting ----
        const ambientLight = new THREE.AmbientLight(0x1a0a04, 2.0);
        scene.add(ambientLight);

        // Copper key light
        const keyLight = new THREE.PointLight(0xd9774e, 8, 60);
        keyLight.position.set(8, 8, 12);
        scene.add(keyLight);

        // Cold fill light
        const fillLight = new THREE.PointLight(0x2a4060, 4, 40);
        fillLight.position.set(-10, -5, 10);
        scene.add(fillLight);

        // Rim light
        const rimLight = new THREE.DirectionalLight(0xf2a679, 1.5);
        rimLight.position.set(0, -10, -5);
        scene.add(rimLight);

        // Mouse-following spotlight
        const mouseSpot = new THREE.PointLight(0xd9774e, 6, 25);
        mouseSpot.position.set(0, 0, 15);
        scene.add(mouseSpot);

        // ---- Instanced Mesh: Coffee Beans ----
        const BEAN_COUNT = 8000;

        const beanGeo = new THREE.SphereGeometry(0.18, 10, 8);
        beanGeo.applyMatrix4(new THREE.Matrix4().makeScale(1.0, 0.65, 1.35));

        const beanMat = new THREE.MeshPhysicalMaterial({
            color: 0x1a0a02,
            metalness: 0.15,
            roughness: 0.7,
            clearcoat: 0.6,
            clearcoatRoughness: 0.3,
            emissive: 0x0a0300,
            emissiveIntensity: 0.3
        });

        const instancedBeans = new THREE.InstancedMesh(beanGeo, beanMat, BEAN_COUNT);
        instancedBeans.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        scene.add(instancedBeans);

        const creaseGeo = new THREE.TorusGeometry(0.1, 0.015, 6, 16);
        creaseGeo.applyMatrix4(new THREE.Matrix4().makeScale(1.0, 0.3, 1.0));

        const creaseMat = new THREE.MeshPhysicalMaterial({
            color: 0x0d0500,
            metalness: 0.1,
            roughness: 0.9,
        });

        const instancedCrease = new THREE.InstancedMesh(creaseGeo, creaseMat, BEAN_COUNT);
        instancedCrease.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        scene.add(instancedCrease);

        // ---- Initial bean data ----
        const beanData = [];
        const dummy = new THREE.Object3D();
        const dummy2 = new THREE.Object3D();

        for (let i = 0; i < BEAN_COUNT; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 5 + Math.random() * 18; 

            const spiralAngle = Math.random() * Math.PI * 2;
            const spiralR = Math.sqrt(Math.random()) * 22;
            const layer = Math.random();

            let x, y, z;
            if (layer < 0.4) {
                x = Math.cos(spiralAngle) * spiralR + (Math.random() - 0.5) * 3;
                y = (Math.random() - 0.5) * 4;
                z = Math.sin(spiralAngle) * spiralR * 0.5 - 5;
            } else if (layer < 0.7) {
                x = Math.sin(phi) * Math.cos(theta) * r;
                y = Math.sin(phi) * Math.sin(theta) * r;
                z = Math.cos(phi) * r - 5;
            } else {
                x = (Math.random() - 0.5) * 40;
                y = (Math.random() - 0.5) * 25;
                z = (Math.random() - 0.5) * 20 - 5;
            }

            const rotX = Math.random() * Math.PI * 2;
            const rotY = Math.random() * Math.PI * 2;
            const rotZ = Math.random() * Math.PI * 2;
            const speed = 0.15 + Math.random() * 0.45;
            const phase = Math.random() * Math.PI * 2;
            const scale = 0.6 + Math.random() * 0.8;

            beanData.push({ x, y, z, rotX, rotY, rotZ, speed, phase, scale, ox: x, oy: y, oz: z });

            dummy.position.set(x, y, z);
            dummy.rotation.set(rotX, rotY, rotZ);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            instancedBeans.setMatrixAt(i, dummy.matrix);

            dummy2.position.set(x, y, z);
            dummy2.rotation.set(rotX + Math.PI / 2, rotY, rotZ);
            dummy2.scale.setScalar(scale);
            dummy2.updateMatrix();
            instancedCrease.setMatrixAt(i, dummy2.matrix);
        }
        instancedBeans.instanceMatrix.needsUpdate = true;
        instancedCrease.instanceMatrix.needsUpdate = true;

        // ---- Background star particles (instanced) ----
        const STAR_COUNT = 1500;
        const starGeo = new THREE.SphereGeometry(0.025, 4, 4);
        const starMat = new THREE.MeshBasicMaterial({
            color: 0xd9774e,
            transparent: true,
            opacity: 0.25
        });
        const stars = new THREE.InstancedMesh(starGeo, starMat, STAR_COUNT);
        const dummyStar = new THREE.Object3D();
        const starPositions = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            const sx = (Math.random() - 0.5) * 80;
            const sy = (Math.random() - 0.5) * 50;
            const sz = (Math.random() - 0.5) * 30 - 10;
            starPositions.push({ x: sx, y: sy, z: sz, phase: Math.random() * Math.PI * 2 });
            dummyStar.position.set(sx, sy, sz);
            dummyStar.updateMatrix();
            stars.setMatrixAt(i, dummyStar.matrix);
        }
        stars.instanceMatrix.needsUpdate = true;
        scene.add(stars);

        // ---- Mouse interactivity ----
        let mouseNDCX = 0;
        let mouseNDCY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseNDCX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseNDCY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        });

        canvas.addEventListener('mouseleave', () => {
            mouseNDCX = 0;
            mouseNDCY = 0;
        });

        // ---- Animation Loop ----
        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            targetMouseX += (mouseNDCX - targetMouseX) * 0.04;
            targetMouseY += (mouseNDCY - targetMouseY) * 0.04;

            camera.position.x = targetMouseX * 4;
            camera.position.y = targetMouseY * 2.5;
            camera.lookAt(0, 0, 0);

            mouseSpot.position.x = targetMouseX * 12;
            mouseSpot.position.y = targetMouseY * 8;
            mouseSpot.position.z = 14;

            for (let i = 0; i < BEAN_COUNT; i++) {
                const d = beanData[i];
                const waveY = Math.sin(elapsed * d.speed + d.phase) * 0.8;
                const waveX = Math.cos(elapsed * d.speed * 0.7 + d.phase + 1.2) * 0.5;

                const rX = d.rotX + elapsed * d.speed * 0.3;
                const rY = d.rotY + elapsed * d.speed * 0.5;
                const rZ = d.rotZ + elapsed * d.speed * 0.2;

                const mx = targetMouseX * 22;
                const my = targetMouseY * 14;
                const dx = d.ox - mx;
                const dy = d.oy - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const repulse = Math.max(0, 1 - dist / 8) * 3;
                const nx = d.ox + waveX + (dx / (dist + 0.01)) * repulse;
                const ny = d.oy + waveY + (dy / (dist + 0.01)) * repulse;

                dummy.position.set(nx, ny, d.oz);
                dummy.rotation.set(rX, rY, rZ);
                dummy.scale.setScalar(d.scale);
                dummy.updateMatrix();
                instancedBeans.setMatrixAt(i, dummy.matrix);

                dummy2.position.set(nx, ny, d.oz);
                dummy2.rotation.set(rX + Math.PI / 2, rY, rZ);
                dummy2.scale.setScalar(d.scale);
                dummy2.updateMatrix();
                instancedCrease.setMatrixAt(i, dummy2.matrix);
            }
            instancedBeans.instanceMatrix.needsUpdate = true;
            instancedCrease.instanceMatrix.needsUpdate = true;

            for (let i = 0; i < STAR_COUNT; i++) {
                const sp = starPositions[i];
                const alpha = 0.1 + Math.abs(Math.sin(elapsed * 0.8 + sp.phase)) * 0.4;
                dummyStar.position.set(sp.x, sp.y, sp.z);
                dummyStar.scale.setScalar(0.8 + Math.sin(elapsed + sp.phase) * 0.3);
                dummyStar.updateMatrix();
                stars.setMatrixAt(i, dummyStar.matrix);
            }
            stars.instanceMatrix.needsUpdate = true;

            keyLight.position.x = Math.sin(elapsed * 0.25) * 12;
            keyLight.position.y = Math.cos(elapsed * 0.2) * 8;
            keyLight.position.z = 12 + Math.sin(elapsed * 0.15) * 3;

            renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
            const newW = section.offsetWidth;
            const newH = section.offsetHeight;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        };
        window.addEventListener('resize', onResize);
    };

    initBeanUniverse();

    /* ======================================================
       2. BEAN UNIVERSE HEADLINE ANIMATIONS
       ====================================================== */
    const initBeanHeadlines = () => {
        const headlines = document.querySelectorAll('.bean-headline');
        if (!headlines.length || typeof gsap === 'undefined') return;

        headlines.forEach((el) => {
            const delay = parseFloat(el.getAttribute('data-delay') || 0);
            gsap.fromTo(el,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    delay: delay,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '#bean-universe',
                        start: 'top 70%'
                    }
                }
            );
        });
    };
    initBeanHeadlines();

    /* ======================================================
       3. CRAFTED ABOUT SECTION ANIMATIONS (Framer Motion Style)
       ====================================================== */
    const initCraftedAboutAnimations = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        const section = document.getElementById('crafted-about');
        if (!section) return;

        // Create a ScrollTrigger timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                end: 'bottom 25%',
                // play forward on enter, reverse on leave, play on re-enter back, reverse on leave back
                toggleActions: 'play reverse play reverse'
            }
        });

        const leftElements = section.querySelector('.lg\\:w-\\[35\\%\\]').children;
        const featureElements = section.querySelectorAll('.lg\\:w-\\[25\\%\\] > div');
        const imageElement = section.querySelector('.lg\\:w-\\[40\\%\\] > div');
        const imgInner = imageElement.querySelector('img');

        // 1. Left Content Text Animation (Staggered Spring fade up)
        tl.fromTo(leftElements,
            { y: 50, opacity: 0, rotateX: 15 },
            { 
                y: 0, 
                opacity: 1, 
                rotateX: 0,
                duration: 0.8, 
                stagger: 0.15, 
                ease: 'back.out(1.4)' // Spring-like ease
            }
        )
        // 2. Middle Features (Staggered slide in)
        .fromTo(featureElements,
            { x: -40, opacity: 0 },
            { 
                x: 0, 
                opacity: 1, 
                duration: 0.7, 
                stagger: 0.1, 
                ease: 'back.out(1.2)' 
            },
            "-=0.6"
        )
        // 3. Right Image Container (Scale & Clip Reveal)
        .fromTo(imageElement,
            { scale: 0.85, opacity: 0, y: 30 },
            { 
                scale: 1, 
                opacity: 1, 
                y: 0,
                duration: 1, 
                ease: 'power3.out'
            },
            "-=0.8"
        )
        // 4. Image Parallax/Zoom effect inside container
        .fromTo(imgInner,
            { scale: 1.2 },
            { scale: 1, duration: 1.2, ease: 'power3.out' },
            "-=1"
        );
    };
    initCraftedAboutAnimations();

});
