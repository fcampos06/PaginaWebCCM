import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const canvas=document.querySelector('#carCanvas');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x02060d,.035);
const camera=new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.1,100);camera.position.set(8,4.1,10.5);
scene.add(new THREE.HemisphereLight(0x7bbcff,0x05080b,1.25));
const key=new THREE.DirectionalLight(0xffffff,5);key.position.set(4,8,6);key.castShadow=true;scene.add(key);
const blue=new THREE.PointLight(0x147bd1,85,18);blue.position.set(-5,2,4);scene.add(blue);
const red=new THREE.PointLight(0xe31d2d,65,16);red.position.set(5,1,-4);scene.add(red);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshStandardMaterial({color:0x05080c,roughness:.48,metalness:.45}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.45;floor.receiveShadow=true;scene.add(floor);

const car=new THREE.Group();scene.add(car);
const paint=new THREE.MeshPhysicalMaterial({color:0x1b2026,metalness:.88,roughness:.2,clearcoat:1,clearcoatRoughness:.08});
const dark=new THREE.MeshStandardMaterial({color:0x080b0e,metalness:.6,roughness:.3});
const glass=new THREE.MeshPhysicalMaterial({color:0x071522,metalness:.2,roughness:.08,transparent:true,opacity:.72,transmission:.18});
const chrome=new THREE.MeshStandardMaterial({color:0xa9b4bd,metalness:1,roughness:.14});
const brakeMat=new THREE.MeshStandardMaterial({color:0x651018,metalness:.65,roughness:.3,emissive:0x000000});
const engineMat=new THREE.MeshStandardMaterial({color:0x252c32,metalness:.8,roughness:.25,emissive:0x000000});
const suspensionMat=new THREE.MeshStandardMaterial({color:0x23292f,metalness:.8,roughness:.25,emissive:0x000000});
const bodyParts=[];
function box(name,size,pos,mat=paint,bevel=.12){const g=new THREE.BoxGeometry(...size,3,2,3);const m=new THREE.Mesh(g,mat);m.name=name;m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;car.add(m);if(mat===paint)bodyParts.push(m);return m}
function cyl(r,len,pos,rot,mat){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,28),mat);m.position.set(...pos);m.rotation.set(...rot);m.castShadow=true;car.add(m);return m}
// R51-inspired SUV proportions: long hood, upright cabin, squared rear.
box('lowerBody',[6.4,1.05,2.65],[0,-.1,0]);box('upperBody',[3.95,1.28,2.48],[-.45,.9,0]);box('hood',[1.85,.42,2.5],[2.25,.52,0]);box('rear',[.65,1.25,2.5],[-2.55,.65,0]);
// windows
box('windshield',[.18,.9,2.18],[1.28,1.16,0],glass);box('sideGlassL',[2.65,.76,.08],[-.42,1.25,1.245],glass);box('sideGlassR',[2.65,.76,.08],[-.42,1.25,-1.245],glass);box('rearGlass',[.14,.78,2.14],[-2.5,1.18,0],glass);
// bumpers / grille
box('frontBumper',[.34,.48,2.72],[3.18,-.35,0],dark);box('rearBumper',[.3,.42,2.72],[-3.18,-.35,0],dark);box('grille',[.09,.62,1.45],[3.37,.25,0],dark);for(let z=-.55;z<=.55;z+=.22)box('grilleBar',[.04,.48,.055],[3.43,.25,z],chrome);
// roof rails and side steps
for(const z of [-1.05,1.05]){box('rail',[3.35,.08,.08],[-.55,1.62,z],chrome);box('step',[4.2,.12,.24],[-.35,-.7,z],dark)}
// lights
const headMat=new THREE.MeshStandardMaterial({color:0xeaf7ff,emissive:0xaedfff,emissiveIntensity:4});const tailMat=new THREE.MeshStandardMaterial({color:0xff2539,emissive:0xe31d2d,emissiveIntensity:2});
for(const z of [-.82,.82]){box('headlight',[.12,.35,.58],[3.38,.52,z],headMat);box('taillight',[.12,.58,.4],[-3.34,.42,z],tailMat)}
// wheels, discs and calipers
const wheels=[];const brakes=[];for(const x of [-2.05,2.02])for(const z of [-1.38,1.38]){const tire=cyl(.68,.38,[x,-.66,z],[Math.PI/2,0,0],new THREE.MeshStandardMaterial({color:0x050505,roughness:.75}));wheels.push(tire);cyl(.4,.4,[x,-.66,z],[Math.PI/2,0,0],chrome);const disc=cyl(.28,.42,[x,-.66,z],[Math.PI/2,0,0],brakeMat);brakes.push(disc)}
// engine and suspension internals
const engine=box('engine',[1.15,.78,1.28],[1.35,.15,0],engineMat);const suspension=[];for(const x of [-2.05,2.02])for(const z of [-.98,.98])suspension.push(cyl(.09,1.1,[x,-.25,z],[0,0,.15],suspensionMat));
// chassis
box('chassis',[4.9,.16,1.55],[-.1,-.72,0],dark);
car.scale.set(1.02,1.02,1.02);car.rotation.y=-.28;

let drag=false,lastX=0,userYaw=0;canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag)return;userYaw+=(e.clientX-lastX)*.006;lastX=e.clientX});canvas.addEventListener('pointerup',()=>drag=false);
const chapters=[
 {n:'01',k:'SYSTEM CHECK',t:'DIAGNÓSTICO',d:'Analizamos las señales del vehículo antes de intervenir.',cam:[8,4.1,10.5],target:[0,.2,0],mode:'normal'},
 {n:'02',k:'POWER UNIT',t:'MOTOR',d:'La carrocería revela el corazón mecánico del vehículo.',cam:[6,3.1,5.7],target:[1.25,.25,0],mode:'engine'},
 {n:'03',k:'STOPPING SYSTEM',t:'FRENOS',d:'La cámara se acerca a las ruedas y destaca el sistema de frenado.',cam:[5.2,.5,5.1],target:[2,-.55,1],mode:'brakes'},
 {n:'04',k:'CHASSIS CONTROL',t:'SUSPENSIÓN',d:'Visualizamos los elementos que mantienen control, estabilidad y confort.',cam:[5.8,.1,7],target:[0,-.45,0],mode:'suspension'},
 {n:'05',k:'CCM WORKSHOP',t:'LISTO PARA EL CAMINO',d:'Diagnóstico, criterio y trabajo responsable.',cam:[9,4.8,12],target:[0,.1,0],mode:'normal'}];
const target=new THREE.Vector3(),desiredCam=new THREE.Vector3();let chapterIndex=-1,scrollP=0;
function applyMode(mode){bodyParts.forEach(m=>{m.material=paint;m.material.transparent=mode!=='normal';m.material.opacity=mode==='normal'?1:.2});engineMat.emissive.set(mode==='engine'?0x147bd1:0);engineMat.emissiveIntensity=mode==='engine'?2.7:0;brakeMat.emissive.set(mode==='brakes'?0xe31d2d:0);brakeMat.emissiveIntensity=mode==='brakes'?4:0;suspensionMat.emissive.set(mode==='suspension'?0x147bd1:0);suspensionMat.emissiveIntensity=mode==='suspension'?3:0}
function setChapter(i){if(i===chapterIndex)return;chapterIndex=i;const c=chapters[i];document.querySelector('#chapterNo').textContent=c.n;document.querySelector('#chapterKicker').textContent=c.k;document.querySelector('#chapterTitle').textContent=c.t;document.querySelector('#chapterText').textContent=c.d;desiredCam.set(...c.cam);target.set(...c.target);applyMode(c.mode)}setChapter(0);
function onScroll(){const sec=document.querySelector('.experience'),r=sec.getBoundingClientRect(),travel=sec.offsetHeight-innerHeight;scrollP=Math.max(0,Math.min(1,-r.top/travel));setChapter(Math.min(4,Math.floor(scrollP*5)));document.querySelector('#progress').style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+'%'}addEventListener('scroll',onScroll,{passive:true});onScroll();
function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();camera.position.lerp(desiredCam,.035);camera.lookAt(target);car.rotation.y+=(userYaw-car.rotation.y)*.045;car.position.y=Math.sin(t*.7)*.025;wheels.forEach(w=>w.rotation.y=t*.22);blue.position.x=Math.sin(t*.5)*6;red.position.z=Math.cos(t*.45)*6;renderer.render(scene,camera)}animate();
