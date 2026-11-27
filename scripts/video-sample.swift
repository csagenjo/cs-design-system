// Genera public/video-autoplay-sample.mp4 (+ .jpg, poster) — animación de 6 s, muda y sin destellos, para playback="autoplay-loop".
// Uso: swift scripts/video-sample.swift public/video-autoplay-sample.mp4 public/video-autoplay-sample.jpg

import AVFoundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let W = 960, H = 540, fps: Int32 = 24, seconds = 6
let out = URL(fileURLWithPath: CommandLine.arguments[1])
let posterURL = URL(fileURLWithPath: CommandLine.arguments[2])
try? FileManager.default.removeItem(at: out)
let writer = try! AVAssetWriter(outputURL: out, fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: W, AVVideoHeightKey: H,
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 400_000, AVVideoProfileLevelKey: AVVideoProfileLevelH264MainAutoLevel]])
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB, kCVPixelBufferWidthKey as String: W, kCVPixelBufferHeightKey as String: H])
writer.add(input); writer.startWriting(); writer.startSession(atSourceTime: .zero)

let cs = CGColorSpaceCreateDeviceRGB()
func c(_ r: Int, _ g: Int, _ b: Int) -> CGColor { CGColor(colorSpace: cs, components: [CGFloat(r)/255, CGFloat(g)/255, CGFloat(b)/255, 1])! }
let bg = c(245,246,248), box = c(255,255,255), line = c(208,212,218), accent = c(0,92,169), soft = c(220,234,247)

func draw(_ ctx: CGContext, t: Double) {
  ctx.setFillColor(bg); ctx.fill(CGRect(x: 0, y: 0, width: W, height: H))
  // marker goes 0→2→0 over the loop (smooth, seamless)
  let p = (1 - cos(2 * Double.pi * t)) // 0..2
  let xs: [CGFloat] = [200, 480, 760]
  ctx.setStrokeColor(line); ctx.setLineWidth(6)
  ctx.move(to: CGPoint(x: xs[0], y: 200)); ctx.addLine(to: CGPoint(x: xs[2], y: 200)); ctx.strokePath()
  for (i, x) in xs.enumerated() {
    let near = max(0, 1 - abs(p - Double(i)) * 1.5)
    let r = CGRect(x: x - 110, y: 250, width: 220, height: 150)
    ctx.addPath(CGPath(roundedRect: r, cornerWidth: 16, cornerHeight: 16, transform: nil))
    ctx.setFillColor(near > 0.5 ? soft : box); ctx.fillPath()
    ctx.addPath(CGPath(roundedRect: r, cornerWidth: 16, cornerHeight: 16, transform: nil))
    ctx.setStrokeColor(near > 0.5 ? accent : line); ctx.setLineWidth(4); ctx.strokePath()
    ctx.setFillColor(near > 0.5 ? accent : line)
    ctx.fill(CGRect(x: x - 70, y: 300, width: 140, height: 14))
    ctx.fill(CGRect(x: x - 70, y: 330, width: 90, height: 14))
    ctx.fillEllipse(in: CGRect(x: x - 14, y: 186, width: 28, height: 28))
  }
  let mx = xs[0] + CGFloat(p) * 280
  ctx.setFillColor(accent); ctx.fillEllipse(in: CGRect(x: mx - 26, y: 174, width: 52, height: 52))
}

let total = Int(fps) * seconds
for f in 0..<total {
  while !input.isReadyForMoreMediaData { usleep(1000) }
  var pb: CVPixelBuffer?
  CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &pb)
  CVPixelBufferLockBaseAddress(pb!, [])
  let ctx = CGContext(data: CVPixelBufferGetBaseAddress(pb!), width: W, height: H, bitsPerComponent: 8,
    bytesPerRow: CVPixelBufferGetBytesPerRow(pb!), space: cs, bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)!
  ctx.translateBy(x: 0, y: CGFloat(H)); ctx.scaleBy(x: 1, y: -1)
  draw(ctx, t: Double(f) / Double(total))
  if f == 0 {
    let img = ctx.makeImage()!
    let dest = CGImageDestinationCreateWithURL(posterURL as CFURL, UTType.jpeg.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(dest, img, [kCGImageDestinationLossyCompressionQuality: 0.8] as CFDictionary)
    CGImageDestinationFinalize(dest)
  }
  CVPixelBufferUnlockBaseAddress(pb!, [])
  adaptor.append(pb!, withPresentationTime: CMTime(value: CMTimeValue(f), timescale: fps))
}
input.markAsFinished()
let sem = DispatchSemaphore(value: 0)
writer.finishWriting { sem.signal() }
sem.wait()
print(writer.status == .completed ? "ok" : "fail \(String(describing: writer.error))")
