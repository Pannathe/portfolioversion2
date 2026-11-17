import Foundation
import Vision
import AppKit

let dir = "/Users/pannadrenko/.cursor/projects/Users-pannadrenko-portfolioversion2/assets"
let names = [
    "image-ee884769-5989-47c2-91c3-e2f991b5f2c0.png",
    "image-2cf63e41-537c-4cc0-b6bf-4a2b2a166f91.png",
    "image-d2c2dd60-3a94-414a-a10c-14aed80acb05.png",
    "image-5fcfcc15-7e11-40cd-bae3-3817beaedd0a.png",
    "image-be0b18d6-7eae-4008-978d-60f5e59d8e3c.png",
    "image-28454c14-20cd-4670-b9d4-f4f0d643d728.png",
    "image-1a29afc8-39dd-4851-b2dc-7f5cb3caffdb.png",
    "image-3f46ef18-0a50-49e0-afdc-aca8eb05a56a.png",
    "image-b0ea36dc-0bdb-4106-a40c-986034b3fa9a.png",
    "image-d3c0841d-9305-473f-b370-c6f6b09c2bc4.png",
    "image-4dabcbb0-b229-4b2b-ad37-464d1118421f.png",
    "image-1ab956b2-b327-4bd5-86f4-151885b61b5f.png",
    "image-d5098206-1cb4-4f74-a961-c8829ff4218a.png",
    "image-4c81ce57-efb4-44fe-a55e-891deb68bae1.png",
    "image-35bdbc95-0541-4276-a0bc-d410548373d5.png",
]

func recognize(_ cg: CGImage) -> String {
    let req = VNRecognizeTextRequest()
    req.recognitionLevel = .accurate
    req.usesLanguageCorrection = false
    let handler = VNImageRequestHandler(cgImage: cg, options: [:])
    try? handler.perform([req])
    return (req.results ?? []).compactMap { $0.topCandidates(1).first?.string }.joined(separator: "\n")
}

for name in names {
    let url = URL(fileURLWithPath: dir + "/" + name)
    guard let img = NSImage(contentsOf: url),
          let tiff = img.tiffRepresentation,
          let rep = NSBitmapImageRep(data: tiff),
          let cg = rep.cgImage else {
        print("FAIL load", name)
        continue
    }
    var bright = 0
    var maxL = 0
    let w = cg.width
    let h = cg.height
    if let data = cg.dataProvider?.data, let ptr = CFDataGetBytePtr(data) {
        let bpp = cg.bitsPerPixel / 8
        let row = cg.bytesPerRow
        for y in stride(from: 0, to: h, by: 4) {
            for x in stride(from: 0, to: w, by: 4) {
                let i = y * row + x * max(bpp, 1)
                let r = Int(ptr[i])
                let g = bpp > 1 ? Int(ptr[i + 1]) : r
                let b = bpp > 2 ? Int(ptr[i + 2]) : r
                let l = max(r, max(g, b))
                if l > maxL { maxL = l }
                if l > 40 { bright += 1 }
            }
        }
    }
    let text = recognize(cg)
    print("===== \(name) \(w)x\(h) maxL=\(maxL) bright=\(bright)")
    print(text.isEmpty ? "(no text)" : text)
    print()
}
