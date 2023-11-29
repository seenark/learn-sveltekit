import type { Action } from "svelte/action";
import { spring } from "svelte/motion";

type SwipeProps = {
  triggerReset: boolean;
};

/**
 * 
 สร้าง action ที่เอาไว้ใช้กับ svelte
 */
export const swipe: Action<HTMLElement, SwipeProps> = (node, params = { triggerReset: false }) => {
  /**
   * เอาไว้เก็บค่า x ของ div ตัวนั้นๆ
   */
  let x = 0;

  /**
   * startingX จะเอาไว้ใช้คำนวนว่าเราเลื่อนไป left หรือ right เกินค่าที่กำหนดไหม ถ้าเกินเราจะ swipe ไปให้สุดในทางนั้นเลย
   * แล้วมันก็จะเด้งๆเป็น spring ด้วยเพราะเราใช้ spring()
   */
  let startingX = 0;
  /**
   * เอาไว้เก็บว่า div ตัวที่เราจะเลื่อนมันซ้ายขวาเนี่ยมันกว้างเท่าไร เพราะเดี๋ยวจะเอาไปคำนวนว่าให้มันเลื่อนไปได้มากสุดแค่ 95% ของความกว้าง
   */
  let elementWidth = node.clientWidth;

  let triggerReset = params.triggerReset;

  /**
   * เอา spring() มาใช้ ซึ่งเป็น fn build-in จาก svelte มันจะเด้งๆ โดยใช้หลัก phisic
   * การตั้งค่า spring ลองไปเล่นดูได้ที่ docs ของ svelte
   */
  const coordinates = spring(
    {
      x: 0,
      y: 0,
    },
    {
      stiffness: 0.2,
      damping: 0.4,
    },
  );

  /**
   * ตรงนี้เรา subscribe การเปลี่ยนแปลงของ spring น่ะแหละ
   * โดยจะเอาค่าการเปลี่ยนแปลง x,y ที่ได้จาก spring มาใส่ใน style ของ div ของเรา
   * โดยจะเห็นว่าใช้ `translate3d` เพราะว่ามันใช้ GPU
   *
   * โดยเราจะใช้แก้แค่ค่า x อย่างเดียวเพราะจะ swipe left & right เท่านั้น
   */
  const unsub = coordinates.subscribe(($coord) => {
    node.style.transform = `translate3d(${$coord.x}px, 0, 0)`;
  });

  /**
   * พอ div เริ่ม mount ไปที่ DOM เ
   * action ก็จะทำงานใช่มะ มันก็จะไป addEventListener ไปที่ div
   * โดยเราจะใส่ mousedown ลงไปก่อน อันนี้มือถือจะยังใช้ไม่ได้เพราะไม่มี mouse
   *
   * ตรงนี้เพิ่มเงื่อนไขว่าถ้าเกิดว่าเป็น mobile เราถึงจะเพิ่ม event `mousedown` ลงไป
   * ถ้าเป็น desktop จะไม่เพิ่ม
   */
  if (isMobileBreakpoint()) {
    node.addEventListener("mousedown", handleMouseDown);
  }

  /**
   * ตรงนี้เอามาแก้ปัญหาเวลาเราปรับขนาดหน้าจอจาก desktop ไปเป็น mobile ผ่าน browser แล้วมัน swipe ไม่ได้
   * หรือปรับหน้าจอจาก mobile ไปเป็น desktop มันก็ยัง swipe ได้
   * เราก็ listen event จาก window ตรงๆเลย
   *
   * จากนั้นเราก็ add หรือ remove EventListener
   *
   * และยังต้อง update ค่าของ elementWidth ด้วยเพราะว่าปัญหาเดียวกันกับ swipe เลย
   * คือพอเป็น desktop ตัว card มันยาวทำให้ 95% ของ desktop width มันยาว เราก็ swipe ไปเยอะ
   * พอปรับหน้าจอมาเป็น mobile แล้วพอ swipe มัน snap จนหายไปเลย
   * หรือกลับกันจากหน้าจอ mobile ขยายเป็น desktop มัน swipe ไปนิดเดียวกดปุ่ไม่ได้อีก
   *
   * เพิ่ม eventListener สำหรับ mobile ด้วยการใช้ touchstart
   *
   * */
  function setupEventListener() {
    // update event mousedown
    if (isMobileBreakpoint()) {
      node.addEventListener("mousedown", handleMouseDown);
      node.addEventListener("touchstart", handleTouchStart);
    } else {
      node.removeEventListener("mousedown", handleMouseDown);
      node.removeEventListener("touchstart", handleTouchStart);
    }

    // update the card width
    elementWidth = node.clientWidth;
  }

  window.addEventListener("resize", () => {
    setupEventListener();
  });

  /**
   *
   * เอาไว้เช็คว่าขณะนี้จอเราเป็นขนาด mobile ไหม
   * ถ้าต่ำกว่า 1024px เราจะถือว่าเป็น mobile ละ
   */
  function isMobileBreakpoint() {
    const mediaQuery = window.matchMedia(`(max-width: 1024px)`);
    if (mediaQuery.matches) {
      return true;
    }
  }

  /**
   * fn นี้จะเอาไว้ reset div ให้มันกลับมาที่เดิมแบบเด้งๆ ด้วยการใส่ x=0,y=0 ใน spring() ไง
   */
  function resetCard() {
    coordinates.update(() => {
      return {
        x: 0,
        y: 0,
      };
    });
    triggerReset = false;
  }

  /**
   * fn นี้จะเอาไว้เพิ่ม event ให้กับ div ของเรา
   * โดยในที่นี้จะเพิ่ม CustomEvent ที่ชื่อว่า `outOfView`
   * ทำให้เราเรียกใช้ `on:outOfView={() => {}}` ที่ div ได้เลย
   *
   * การทำงานคือเมื่อเรียกใช้ fn นี้แล้วเราค่อยเพิ่ม CustomEvent ลงไป
   * ไม่ได้เพิ่มทันทีที่ mount div นี้ลงไปที่ DOM
   */
  function outOfView() {
    node.dispatchEvent(new CustomEvent("outOfView"));
  }

  /**
   *
   * funciton นี้จะเอาไว้ใช้กับ addEventListener mousedown
   * โดยสิ่งที่เราจะทำคือเก็บจุดที่เรา mousedown ไว้ในตัวแปร x กับ startingX
   * พอ mousedown ปุ๊ป เราก็เพิ่ม eventListener อีก 2 ตัวคือ mousemove และ mouseup
   *
   */
  function handleMouseDown(event: MouseEvent) {
    x = event.clientX;
    startingX = event.clientX;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  /**
   *
   * funciton นี้จะเอาไว้ใช้กับ addEventListener touchstart
   * โดยสิ่งที่เราจะทำคือเก็บจุดที่เรา touch ด้วยนิ้วแรก ไว้ในตัวแปร x กับ startingX
   * โดยเราจะเอาค่า `clientX` ออกมาจาก `touches` เพราะมัน touch ได้หลายนิ้ว แต่เราจะเอานิ้วแรก
   * พอเริ่มแตะ ปุ๊ป เราก็เพิ่ม eventListener อีก 2 ตัวคือ touchmove และ touchend
   *
   */
  function handleTouchStart(event: TouchEvent) {
    x = event.touches[0].clientX;
    startingX = event.touches[0].clientX;
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  }

  /**
   * การทำงานของ mousemove คือ
   * คำนวนว่าเราเลื่อนไป left หรือ right เท่าไร แล้วเอาไว้ที่ตัวแปร `dx`
   * แล้วก็ update ตัวแปร `x` ด้วย ขณะที่เราเลื่อนไป ตัว div มันมี x เปลี่ยนไปตลอดเราก็ update x ตามไป
   *
   * เราก็ update spring ผ่าน update()
   * โดยเราจะแก้ค่า x ใน spring อย่างเดียว
   * โดยค่า x ที่เราจะใส่ไปนั้นจะเป็นค่า x เดิมรวมกับ dx ที่เราเลื่อนไป กลายเป็น ค่า x สุดท้ายที่เราอยากให้ div มันไปอยู่ตรงนั้น
   * แล้ว spring ก็จะไปปรับแต่งให้มันเด้งๆ
   * ส่วนจุดที่เรา subscribe ไว้มันก็จะเลื่อน div นี้ให้เองผ่าน style `transform3d`
   *
   */
  function handleMouseMove(event: MouseEvent) {
    // delta x = different from where we clicked vs where we are currently
    const dx = event.clientX - x;
    x = event.clientX;
    coordinates.update(($coord) => {
      return {
        x: $coord.x + dx,
        y: 0,
      };
    });
  }

  /**
   * การทำงานของ touchmove คือ
   * tldr ทำเหมือนกับ handleMouseMove เด๊ะๆ
   *
   * คำนวนว่าเราเลื่อนไป left หรือ right เท่าไร แล้วเอาไว้ที่ตัวแปร `dx`
   * แล้วก็ update ตัวแปร `x` ด้วย ขณะที่เราเลื่อนไป ตัว div มันมี x เปลี่ยนไปตลอดเราก็ update x ตามไป
   *
   * เราก็ update spring ผ่าน update()
   * โดยเราจะแก้ค่า x ใน spring อย่างเดียว
   * โดยค่า x ที่เราจะใส่ไปนั้นจะเป็นค่า x เดิมรวมกับ dx ที่เราเลื่อนไป กลายเป็น ค่า x สุดท้ายที่เราอยากให้ div มันไปอยู่ตรงนั้น
   * แล้ว spring ก็จะไปปรับแต่งให้มันเด้งๆ
   * ส่วนจุดที่เรา subscribe ไว้มันก็จะเลื่อน div นี้ให้เองผ่าน style `transform3d`
   *
   */
  function handleTouchMove(event: TouchEvent) {
    // delta x = different from where we clicked vs where we are currently
    const dx = event.touches[0].clientX - x;
    x = event.touches[0].clientX;
    coordinates.update(($coord) => {
      return {
        x: $coord.x + dx,
        y: 0,
      };
    });
  }

  /**
   *  เอาไว้ set ค่า x ผ่าน spring ได้ง่ายๆ
   */
  function updateCoordinates(x: number) {
    coordinates.update(() => {
      return {
        x,
        y: 0,
      };
    });
  }

  /**
   *
   * เป็น fn ที่จะเอาไว้เลื่อน div ให้ไปอยู่ด้านข้างสุดเลยหาก user เลื่อนไปเกิน 20px
   * โดยเราจะรับตำแหน่งสุดท้ายที่ user เลื่อนไปผ่าน `endingX`
   * แล้วดูว่าเลื่อนไปซ้ายหรือขวา แล้วก็ update spring() ผ่าน fn `updateCoordinates`
   *
   * ถ้าหากเลื่อนไปทางซ้าย เราจะใส่ CustomEvent `outOfView` ด้วย ด้วยการเรียก fn `outOfView()`
   *
   */
  function moveCardOver(endingX: number) {
    const leftSnap = elementWidth * -0.95;
    const rightSnap = 0;
    const movement = startingX - endingX;
    const moveThreshold = 20;

    // swiped left
    if (movement > moveThreshold) {
      x = leftSnap;
      outOfView();
    }

    // swiped right
    if (movement < moveThreshold * -1) {
      x = rightSnap;
    }
    updateCoordinates(x);
  }

  /**
   *
   * เมื่อเอา mouseup
   * เราก็จะ snap div ไปที่ซ้ายหรือขวาผ่าน fn `moveCardOver`
   * จากนั้นเราก็ remove eventListener ออกให้หมด
   *
   */
  function handleMouseUp(event: MouseEvent) {
    const endingX = event.clientX;
    moveCardOver(endingX);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  /**
   *
   * เมื่อเอานิ้วขึ้น จะทำงาน
   * tldr; ทำเหมือนกับ mouseup เด๊ะๆ
   * เราก็จะ snap div ไปที่ซ้ายหรือขวาผ่าน fn `moveCardOver`
   * จากนั้นเราก็ remove eventListener ออกให้หมด
   *
   */
  function handleTouchEnd(event: TouchEvent) {
    const endingX = event.changedTouches[0].clientX;
    moveCardOver(endingX);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
  }

  return {
    /**
     * เมื่อ div update เราจะได้ params มาเหมือนกับตอนที่ mount div ไปที่ DOM น่ะแหละ
     * เราก็แค่สั้งให้มัน reset card position กลับไปที่เดิมแบบเด้งๆ ผ่าน fn `resetCard()`
     *
     */
    update(newParams: SwipeProps) {
      if (newParams.triggerReset === true) {
        resetCard();
      }
    },

    /**
     * อันนี้ก็ remove eventListener mousedown, touchstart ออก
     * ที่เอาออกตรงนี้ เพราะว่าเราเพิ่มมันตอนที่เริ่ม action เลย
     * ตอนที่ mount div มาที่ DOM อ่ะนะ
     */
    destroy() {
      node.removeEventListener("mousedown", handleMouseDown);
      node.removeEventListener("touchstart", handleTouchStart);
      unsub();
    },
  };
};
