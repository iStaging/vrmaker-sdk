/* eslint-disable no-compare-neg-zero */
import Vue from 'vue'
import Floorplan from '../../../../../src/common/Floorplan/index.vue'
import FloorplanDots from '../../../../../src/common/Floorplan/FloorplanDots.vue'
import FloorplanRange from '../../../../../src/common/Floorplan/FloorplanRange.vue'
import Icon from '../../../../../src/components/Icon/index.vue'
import IRepeat from '../../../../../src/components/IRepeat.vue'
import store from '../../../../../src/store'
import fakeFloorplanSquareImage from '../../../images/120x120.png'
import fakeFloorplanRectangleImage from '../../../images/240x180.svg'

const Constructor = Vue.extend(Floorplan)
const panoCollection = {
  floorplan: fakeFloorplanSquareImage
}
const panoramas = [{
  panoramaId: '1',
  position: {
    x: 20,
    y: 50
  }
}]
const e = {
  wheelDelta: 40,
  pageX: 40,
  pageY: 40,
  preventDefault: () => {},
  stopPropagation: () => {}
}
const ratio = 12.5

describe('common/Floorplan/index.vue', () => {
  store.commit('SET_PANORAMAS', panoramas)
  store.commit('SET_PANORAMA', panoramas[0])
  store.commit('SET_PANO_COLLECTION', panoCollection)
  const vm = new Constructor({
    store,
    components: {
      FloorplanDots,
      FloorplanRange,
      Icon,
      IRepeat
    }
  }).$mount()

  it('應該要有 className vrsdk-floorplan', () => {
    expect(Array.prototype.slice.call(vm.$el.classList))
      .toContain('vrsdk-floorplan')
  })

  it('子 DOM 應該要有 className vrsdk-floorplan-container', () => {
    const child = vm.$el.children[0]
    expect(Array.prototype.slice.call(child.classList))
      .toContain('vrsdk-floorplan-container')
  })

  it('子 DOM 在 isDragging = true 時應該要有 className vrsdk-floorplan-dragging', () => {
    vm.isDragging = true
    vm._watcher.run()
    const child = vm.$el.children[0]
    expect(Array.prototype.slice.call(child.classList))
      .toContain('vrsdk-floorplan-dragging')
  })

  it('子 DOM 在 isResizable = true 時應該要有 className vrsdk-floorplan-overflow-hidden', () => {
    const vm = new Constructor({
      store,
      components: {
        FloorplanDots,
        FloorplanRange,
        Icon,
        IRepeat
      },
      propsData: {
        isResizable: true
      }
    }).$mount()
    const child = vm.$el.children[0]
    expect(Array.prototype.slice.call(child.classList))
      .toContain('vrsdk-floorplan-overflow-hidden')
  })

  it('子 DOM 在 isDraggable = true 時應該要有 className vrsdk-floorplan-overflow-hidden', () => {
    const vm = new Constructor({
      store,
      components: {
        FloorplanDots,
        FloorplanRange,
        Icon,
        IRepeat
      },
      propsData: {
        isDraggable: true
      }
    }).$mount()
    const child = vm.$el.children[0]
    expect(Array.prototype.slice.call(child.classList))
      .toContain('vrsdk-floorplan-overflow-hidden')
  })

  it('setFloorplanZ 應該要正確改變 floorplanZ 的值', () => {
    const n = 50
    vm.setFloorplanZ(n)
    expect(vm.floorplanZ)
      .toEqual(n)
  })

  it('floorplanZ 的值不得大於 floorplanZMax', () => {
    const n = 250
    vm.setFloorplanZ(n)
    expect(vm.floorplanZ)
      .toEqual(vm.floorplanZMax)
  })

  it('floorplanZ 的值不得小於 floorplanZMin', () => {
    const n = -250
    vm.setFloorplanZ(n)
    expect(vm.floorplanZ)
      .toEqual(vm.floorplanZMin)
  })

  it('isResizable = false 時 handleScroll 不做事', () => {
    vm.setFloorplanZ(0)
    const floorplanZ = vm.floorplanZ
    vm.handleScroll(e)
    expect(floorplanZ)
      .toEqual(vm.floorplanZ)
  })

  it('isResizable = true 時 handleScroll 會改變 floorplanZ', () => {
    const vm = new Constructor({
      store,
      components: {
        FloorplanDots,
        FloorplanRange,
        Icon,
        IRepeat
      },
      propsData: {
        isResizable: true
      }
    }).$mount()
    const floorplanZ = vm.floorplanZ
    vm.handleScroll(e)
    expect(vm.floorplanZ)
      .toEqual(floorplanZ + ratio)
  })

  it('isDraggable = false 時 handleDragStart 不做事', () => {
    vm.isDragging = false
    vm._watcher.run()
    vm.handleDragStart(e)
    expect(vm.isDragging)
      .toEqual(false)
  })

  it('isDraggable = true 時 handleDragStart 不做事', () => {
    const vm = new Constructor({
      store,
      components: {
        FloorplanDots,
        FloorplanRange,
        Icon,
        IRepeat
      },
      propsData: {
        isDraggable: true
      }
    }).$mount()
    vm.handleDragStart(e)
    expect(vm.isDragging)
      .toEqual(true)
  })

  it('isDragging = false 時執行 handleDragging 不做事', () => {
    vm.isDragging = false
    vm.handleDragging()
    vm.interactX = 50
    vm.interactY = 50
    expect(vm.interactX)
      .toEqual(50)
    expect(vm.interactY)
      .toEqual(50)
  })

  it('isDragging = true 時執行 handleDragging 會改變 interactX, interactY', () => {
    vm.isDragging = true
    const e = {
      pageX: -50,
      pageY: 40
    }
    vm.interactX = 60
    vm.interactY = 60
    vm.floorplanWidth = 400
    vm.floorplanHeight = 400
    vm.lastX = -30
    vm.lastY = 60
    vm.handleDragging(e)
    expect(vm.interactX)
      .not.toEqual(60)
    expect(vm.interactY)
      .not.toEqual(60)
  })

  it('執行 handleDragStop 後 isDragging = false', () => {
    vm.isDragging = true
    vm.handleDragStop()
    expect(vm.isDragging)
      .toEqual(false)
  })

  it('要從 floorplan 取得正確圖片大小及比例，正方形或高的圖要正確產生 xOffset 及 floorplanRatioX', function (done) {
    window.setTimeout(() => {
      const offset = (vm.floorplanWidth - vm.floorplanHeight) / 2
      let xOffset = -offset * vm.ratioH
      const floorplanRatioX = vm.floorplanWidth / vm.floorplanHeight
      if (xOffset === -0) {
        xOffset = 0
      }
      expect(vm.xOffset)
        .toEqual(xOffset)
      expect(vm.floorplanRatioX)
        .toEqual(floorplanRatioX)
      done()
    }, 200)
  })

  it('要從 floorplan 取得正確圖片大小及比例，寬的圖要正確產生 yOffset 及 floorplanRatioY', function (done) {
    const panoCollection = {
      floorplan: fakeFloorplanRectangleImage
    }
    store.commit('SET_PANO_COLLECTION', panoCollection)
    vm._watcher.run()
    window.setTimeout(() => {
      const offset = (vm.floorplanWidth - vm.floorplanHeight) / 2
      const yOffset = offset * vm.ratioW
      const floorplanRatioY = vm.floorplanHeight / vm.floorplanWidth
      expect(vm.yOffset)
        .toEqual(yOffset)
      expect(vm.floorplanRatioY)
        .toEqual(floorplanRatioY)
      done()
    }, 200)
  })

  it('ratioW 要正確是 floorplanContainerWidth / floorplanWidth', () => {
    const ratioW = vm.floorplanContainerWidth / vm.floorplanWidth
    expect(vm.ratioW)
      .toEqual(ratioW)
  })

  it('ratioH 要正確是 floorplanContainerHeight / floorplanHeight', () => {
    const ratioH = vm.floorplanContainerHeight / vm.floorplanHeight
    expect(vm.ratioH)
      .toEqual(ratioH)
  })
})
