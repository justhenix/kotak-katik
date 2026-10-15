import type { Page } from '@playwright/test';
import { OrthographicCamera, Vector3 } from 'three';

export async function boardIsVisible(page: Page) {
  const { frame, tiles, canvas, header, feedback } = await page.evaluate(() => ({
    frame: document.querySelector('canvas')!.dataset.cameraFrame!, tiles: document.querySelector('canvas')!.dataset.playableTiles!,
    canvas: document.querySelector('canvas')!.getBoundingClientRect().toJSON(), header: document.querySelector('.game-header')!.getBoundingClientRect().toJSON(),
    feedback: document.querySelector('.feedback')!.getBoundingClientRect().toJSON(),
  }));
  const data = JSON.parse(frame);
  const camera = new OrthographicCamera(-canvas.width/2,canvas.width/2,canvas.height/2,-canvas.height/2,.1,100);
  camera.position.fromArray(data.position); camera.quaternion.fromArray(data.rotation); camera.zoom = data.zoom;
  camera.updateMatrixWorld(); camera.updateProjectionMatrix();
  return (JSON.parse(tiles) as {x:number;z:number}[]).every(tile => [-.56,.56].every(dx => [-.56,.56].every(dz => [-.4,1.2].every(y => {
    const point = new Vector3(tile.x+dx,y,tile.z+dz).project(camera);
    const x = canvas.x+(1+point.x)*canvas.width/2, sy = canvas.y+(1-point.y)*canvas.height/2;
    return x >= 0 && x <= canvas.width && sy >= header.bottom && sy < feedback.top;
  }))));
}
