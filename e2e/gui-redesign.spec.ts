import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { boardIsVisible } from './board-frame';
import { setRepeatCount } from './repeat-counter';

const b = (page:Page,name:string) => page.getByRole('button',{name,exact:true});
const feedback = (page:Page) => page.locator('.feedback');
async function ready(page:Page,url:string) {
  await page.goto(url); await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy','false');
}
async function append(page:Page,name:string,index:number,owner?:number) {
  await b(page,`Tambah di posisi ${index+1}${owner===undefined?'':` dalam Ulangi ${owner+1}`}`).click();
  await b(page,`Tambah ${name}${owner===undefined?'':` ke Ulangi ${owner+1}`}`).click();
}
async function dismiss(page:Page) {
  const close = b(page,'Tutup pilihan'); if (await close.isVisible()) await close.click();
}
async function acceptance(page:Page) {
  await expect(page.locator('[role="dialog"], .command-popover, .selection-tools, .repeat-item')).toHaveCount(0);
  const bounds = await page.evaluate(() => {
    const header=document.querySelector('.game-header')!.getBoundingClientRect(), dock=document.querySelector('.workbench')!.getBoundingClientRect(), world=document.querySelector('.world-area')!.getBoundingClientRect();
    const row=document.querySelector('.dock-context')?.getBoundingClientRect();
    return { width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,headerHeight:header.height,dock:dock.toJSON(),worldHeight:world.height,row:row?.toJSON() };
  });
  expect(bounds.overflow).toBe(false);
  expect(bounds.headerHeight).toBeLessThan(75);
  expect(bounds.dock.bottom).toBeLessThanOrEqual(bounds.height);
  expect(bounds.dock.height / bounds.height).toBeLessThanOrEqual(.28);
  expect(bounds.worldHeight / bounds.height).toBeGreaterThanOrEqual(.55);
  if(bounds.row) expect(bounds.row.height).toBeLessThanOrEqual(70);
  await expect.poll(()=>boardIsVisible(page)).toBe(true);
}
const errorsByPage = new WeakMap<Page,string[]>();
test.beforeEach(async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  const errors:string[]=[]; errorsByPage.set(page,errors);
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
});
test.afterEach(async({page})=>expect(errorsByPage.get(page)).toEqual([]));

test('one add palette supports repeated taps, then one inline row edits the selected block',async({page})=>{
  await ready(page,'/?fixture=turning');
  await expect(page.locator('.dock-context')).toHaveCount(0);
  await b(page,'Tambah di posisi 1').click();
  for(let i=0;i<3;i++) await b(page,'Tambah Maju').click();
  await expect(page.locator('.command-block')).toHaveCount(3);
  await expect(page.locator('.dock-context .palette-area')).toBeVisible();
  await b(page,'Pilih perintah 2: Maju').click();
  await expect(page.locator('.palette-area')).toHaveCount(0);
  await expect(page.locator('.dock-context')).toHaveCount(1);
  await b(page,'Ganti perintah').click(); await b(page,'Ganti dengan Kiri').click();
  await expect(page.locator('.dock-context')).toHaveCount(0);
  await b(page,'Pilih perintah 2: Kiri').click();
  await b(page,'Geser perintah 2 sebelumnya').click();
  await expect(b(page,'Pilih perintah 1: Kiri')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(b(page,'Pilih perintah 1: Kiri')).toBeFocused();
  await b(page,'Pilih perintah 1: Kiri').click();
  await b(page,'Tambah di posisi 1').click(); await b(page,'Tambah Kanan').click();
  await b(page,'Pilih perintah 2: Kiri').click(); await b(page,'Hapus perintah 2: Kiri').click();
  await expect(page.locator('.command-block')).toHaveCount(3);
  await acceptance(page);
});

test('Repeat is one outer piece and its contents reuse the same strip with an explicit return',async({page})=>{
  await ready(page,'/?fixture=loops');
  await append(page,'Ulangi',0);
  await expect(page.locator('.command-block')).toHaveCount(1);
  await expect(page.locator('.dock-context .repeat-counter')).toBeVisible();
  await setRepeatCount(page,0,3);
  await b(page,'Edit isi Ulangi 1').click();
  await expect(page.locator('.command-dock')).toHaveAttribute('data-scope','repeat-0');
  await expect(page.locator('.program-sequence')).toHaveCount(1);
  await append(page,'Maju',0,0); await b(page,'Tambah Kanan ke Ulangi 1').click(); await dismiss(page);
  await b(page,'Pilih perintah 2 di Ulangi 1: Kanan').click(); await b(page,'Ganti perintah').click(); await b(page,'Ganti dengan Kiri').click();
  await b(page,'Pilih perintah 2 di Ulangi 1: Kiri').click(); await b(page,'Ganti perintah').click(); await b(page,'Ganti dengan Kanan').click();
  await b(page,'Kembali ke urutan').click();
  await expect(page.locator('.command-block')).toHaveCount(1);
  await expect(b(page,'Pilih Ulangi 1').locator('.repeat-count')).toHaveText('3×');
  await b(page,'Satu langkah').click();
  await expect(feedback(page)).toHaveAttribute('data-actions','1');
  await expect(feedback(page)).toHaveAttribute('data-orientation','east');
  const camera=await page.locator('canvas').getAttribute('data-camera-frame');
  await b(page,'Satu langkah').click();
  await expect(feedback(page)).toHaveAttribute('data-actions','2');
  await expect(feedback(page)).toHaveAttribute('data-orientation','south');
  await expect(page.locator('canvas')).toHaveAttribute('data-camera-frame',camera!);
  await b(page,'Jalankan').click(); await expect(feedback(page)).toHaveAttribute('data-status','completed');
  await expect(page.getByLabel('3 dari 3 ikan terkumpul')).toBeVisible();
  await b(page,'Jalankan lagi').click(); await expect(feedback(page)).toHaveAttribute('data-status','completed');
  await page.locator('summary').click(); await b(page,'Mulai ulang').click();
  await expect(feedback(page)).toHaveAttribute('data-actions','0');
  await expect(page.locator('.command-block')).toHaveCount(0);
  await append(page,'Ulangi',0); await b(page,'Pilihan Ulangi').click();
  await expect(page.locator('.delete-selected')).toHaveCount(1);
  await b(page,'Hapus Ulangi 1').click(); await expect(page.locator('.command-block')).toHaveCount(0);
});

test('Stop cancels queued work and failure remains inspectable until the program is changed',async({page})=>{
  await ready(page,'/?fixture=turning'); await b(page,'Tambah di posisi 1').click();
  for(let i=0;i<8;i++) await b(page,'Tambah Kanan').click();
  await b(page,'Jalankan').click();
  await page.waitForFunction(()=>Number(document.querySelector<HTMLElement>('.feedback')?.dataset.actions)>0 && document.querySelector<HTMLElement>('.feedback')?.dataset.status==='running',undefined,{polling:'raf'});
  await b(page,'Berhenti').focus(); await page.keyboard.press('Enter');
  await expect(feedback(page)).toHaveAttribute('data-status','paused');
  const actions=await feedback(page).getAttribute('data-actions');
  expect(Number(actions)).toBeGreaterThan(0); expect(Number(actions)).toBeLessThan(8);
  await page.waitForTimeout(850); await expect(feedback(page)).toHaveAttribute('data-actions',actions!);
  await page.locator('summary').click(); await b(page,'Mulai ulang').click();
  await b(page,'Tambah di posisi 1').click(); await b(page,'Tambah Maju').click(); await b(page,'Tambah Maju').click();
  await b(page,'Jalankan').click(); await expect(feedback(page)).toHaveAttribute('data-status','failed');
  await b(page,'Pilih perintah 2: Maju').click();
  await expect(feedback(page)).toHaveAttribute('data-status','failed');
  await expect(page.locator('.failed-command')).toBeVisible();
  await page.waitForTimeout(1300); await expect(feedback(page)).toHaveAttribute('data-visible','true');
  await b(page,'Ganti perintah').click(); await b(page,'Ganti dengan Kiri').click();
  await expect(feedback(page)).toHaveAttribute('data-status','idle');
});

test('tutorial hand follows actual inline choices, count control and Play; debugging retains single Step inspection',async({page})=>{
  await ready(page,'/?level=m2-move-try');
  await expect(page.locator('.ghost-hand')).toHaveAttribute('data-target','.editor .insert-slot.chosen-target');
  await b(page,'Tambah di posisi 2').click();
  await expect(page.locator('.palette-command.instruction-focus, .palette-commands.instruction-focus')).toBeVisible();
  await b(page,'Tambah Maju').click();
  await expect(page.locator('.dock-context')).toHaveCount(0);
  await expect(page.locator('.ghost-hand')).toHaveAttribute('data-target','.run-button');
  await b(page,'Jalankan').click(); await expect(feedback(page)).toHaveAttribute('data-status','completed');
  await expect(b(page,'Lanjut')).toBeVisible();
  await ready(page,'/?level=m2-repeat-together'); await b(page,'Pilih Ulangi 1').click();
  await expect(page.locator('.ghost-hand')).toHaveAttribute('data-target','[data-count-index="0"]');
  await setRepeatCount(page,0,3); await b(page,'Jalankan').click(); await expect(feedback(page)).toHaveAttribute('data-status','completed');
  await ready(page,'/?level=m2-debug-together'); await b(page,'Jalankan').click(); await expect(feedback(page)).toHaveAttribute('data-status','finished');
  await expect(page.locator('.step-button')).toHaveCount(1);
  await b(page,'Periksa satu per satu').click();
  for(let i=0;i<3;i++) { await b(page,'Satu langkah').click(); await expect(feedback(page)).toHaveAttribute('data-actions',`${i+1}`); }
  await append(page,'Maju',3); await b(page,'Jalankan').click(); await expect(feedback(page)).toHaveAttribute('data-status','completed');
});

test('Repeat body ordering and limits remain editable, and execution follows body, outer action, then another Repeat',async({page})=>{
  await ready(page,'/?fixture=loops'); await append(page,'Ulangi',0); await setRepeatCount(page,0,3);
  await b(page,'Edit isi Ulangi 1').click(); await append(page,'Kanan',0,0); await b(page,'Tambah Maju ke Ulangi 1').click();
  await b(page,'Pilih perintah 2 di Ulangi 1: Maju').click(); await b(page,'Geser perintah 2 di Ulangi 1 sebelumnya').click();
  await expect(page.locator('.command-block').first()).toHaveClass(/forward/);
  await append(page,'Maju',2,0); await expect(page.locator('.insert-slot')).toHaveCount(0);
  await b(page,'Pilih perintah 3 di Ulangi 1: Maju').click(); await b(page,'Hapus perintah 3 di Ulangi 1: Maju').click();
  await expect(b(page,'Tambah di posisi 3 dalam Ulangi 1')).toBeVisible(); await b(page,'Kembali ke urutan').click();
  await append(page,'Kiri',1); await b(page,'Tambah Ulangi').click(); await b(page,'Edit isi Ulangi 3').click();
  await append(page,'Kanan',0,2); await b(page,'Kembali ke urutan').click();
  const paths=['0.0','0.1','0.0','0.1','0.0','0.1','1','2.0','2.0'];
  for(const [index,path] of paths.entries()) {
    await b(page,'Satu langkah').click();
    await expect(feedback(page)).toHaveAttribute('data-actions',`${index+1}`);
    await expect(page.locator('[aria-current="step"]')).toHaveAttribute('data-command-path',path);
    await expect(page.locator('.command-dock')).toHaveAttribute('data-scope',path.includes('.')?`repeat-${path[0]}`:'program');
    if(path.includes('.')) await expect(page.locator('.scope-back span')).toHaveText(index<6?`${Math.floor(index/2)+1}/3`:`${index-6}/2`);
  }
  await expect(feedback(page)).toHaveAttribute('data-status','completed');
});

test('visual acceptance: six required real states, one-row HUD and dock, no board overlays, plus enlarged text',async({page})=>{
  test.setTimeout(120_000);
  const capture=async(name:string)=>{await acceptance(page); await page.screenshot({path:`docs/evidence/dock-rebuild/${name}.png`});};
  await page.setViewportSize({width:390,height:844}); await ready(page,'/?level=m2-turn-alone');
  await append(page,'Maju',0); await b(page,'Tambah Kiri').click(); await b(page,'Tambah Maju').click();
  await capture('390-adding'); await dismiss(page); await capture('390-idle');
  await ready(page,'/?fixture=loops'); await append(page,'Ulangi',0); await setRepeatCount(page,0,3); await capture('390-repeat-selected');
  await b(page,'Edit isi Ulangi 1').click(); await page.setViewportSize({width:320,height:740});
  await append(page,'Maju',0,0); await b(page,'Tambah Kanan ke Ulangi 1').click(); await dismiss(page); await capture('320-repeat-body');
  await page.setViewportSize({width:390,height:844}); await ready(page,'/?level=m2-debug-together');
  await b(page,'Jalankan').click(); await expect(feedback(page)).toHaveAttribute('data-status','finished');
  await b(page,'Periksa satu per satu').click(); await b(page,'Satu langkah').click(); await b(page,'Pilih perintah 3: Kanan').click(); await capture('390-debugging');
  await ready(page,'/?level=m2-move-try'); await append(page,'Maju',1); await b(page,'Jalankan').click(); await expect(feedback(page)).toHaveAttribute('data-status','completed'); await capture('390-completion');
  await ready(page,'/?fixture=turning'); await append(page,'Maju',0); await b(page,'Tambah Maju').click();
  await b(page,'Jalankan').click(); await expect(feedback(page)).toHaveAttribute('data-status','failed'); await capture('390-failure');
  await page.setViewportSize({width:1440,height:900}); await ready(page,'/?fixture=turning');
  await append(page,'Maju',0); await b(page,'Tambah Kanan').click(); await b(page,'Tambah Maju').click(); await b(page,'Pilih perintah 2: Kanan').click(); await capture('1440-editing');
  await ready(page,'/?fixture=loops'); await append(page,'Ulangi',0); await setRepeatCount(page,0,3); await capture('1440-repeat');
  await b(page,'Edit isi Ulangi 1').click(); await append(page,'Maju',0,0); await b(page,'Tambah Kanan ke Ulangi 1').click(); await b(page,'Kembali ke urutan').click();
  await b(page,'Jalankan').click(); await expect(feedback(page)).toHaveAttribute('data-status','completed'); await capture('1440-success');
  for(const [width,height] of [[1440,900],[390,844],[320,740]]) {
    await page.setViewportSize({width,height}); await ready(page,'/?fixture=loops'); await append(page,'Ulangi',0);
    await page.addStyleTag({content:'html { font-size:200%; }'}); await acceptance(page);
    for(const control of await page.locator('.dock-context button, .repeat-counter output, .game-header button, .fish-progress').all()) {
      expect(await control.evaluate(node=>node.scrollWidth<=node.clientWidth)).toBe(true);
    }
    await page.screenshot({path:`docs/evidence/dock-rebuild/${width}-zoom.png`});
  }
});

test('optional pointer and touch drag keep scope rules while tap editing remains sufficient',async({page},info)=>{
  await ready(page,'/?fixture=turning');
  const drag=async(source:Locator,destination:Locator,fraction=.5)=>{
    const from=(await source.boundingBox())!,to=(await destination.boundingBox())!;
    const start={x:from.x+from.width/2,y:from.y+from.height/2},end={x:to.x+to.width*fraction,y:to.y+to.height/2};
    if(info.project.name==='mobile') {
      const session=await page.context().newCDPSession(page);
      await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...start,id:0}]});
      await page.waitForTimeout(220);
      for(let i=1;i<=12;i++)await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x+(end.x-start.x)*i/12,y:start.y+(end.y-start.y)*i/12,id:0}]});
      await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await session.detach();
    }else{await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(end.x,end.y,{steps:12});await page.mouse.up();}
  };
  await b(page,'Tambah di posisi 1').click(); await drag(b(page,'Tambah Maju'),b(page,'Tambah di posisi 1'));
  await expect(page.locator('.command-block')).toHaveCount(1);
  await append(page,'Kanan',1); await dismiss(page);
  await drag(b(page,'Pilih perintah 2: Kanan'),b(page,'Pilih perintah 1: Maju'),.15);
  await expect(page.locator('.command-block').first()).toHaveClass(/turn-right/);
  await expect(page.locator('.command-block')).toHaveCount(2); await expect(page.locator('.drag-preview')).toHaveCount(0);
  await dismiss(page); await append(page,'Maju',2);
  for(let i=0;i<5;i++)await b(page,'Tambah Maju').click();
  await dismiss(page);
  if(info.project.name==='mobile') {
    const strip=page.locator('.program-sequence'); await strip.focus(); await page.keyboard.press('Home');
    const from=(await page.locator('.command-block').nth(1).boundingBox())!;
    const session=await page.context().newCDPSession(page), x=from.x+from.width/2,y=from.y+from.height/2;
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:0}]});
    for(let i=1;i<=6;i++)await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*14,y,id:0}]});
    await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await session.detach();
    expect(await strip.evaluate(node=>node.scrollLeft)).toBeGreaterThan(20);
    await expect(page.locator('.command-block')).toHaveCount(8); await expect(page.locator('.drag-preview')).toHaveCount(0);
  }
});
