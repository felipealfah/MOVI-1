import React from 'react';
import CodeBlock from '../common/CodeBlock';
import { Sparkles, ShoppingCart, GraduationCap, MessageSquare } from 'lucide-react';

export default function Examples() {
  const productVideoExample = `{
  "timeline": {
    "background": "#000000",
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "video",
              "src": "https://example.com/product-demo.mp4",
              "trim": 2
            },
            "start": 0,
            "length": 8,
            "fit": "cover"
          }
        ]
      },
      {
        "clips": [
          {
            "asset": {
              "type": "text",
              "text": "Premium Wireless Headphones",
              "font": {
                "family": "Montserrat",
                "color": "#ffffff",
                "size": 56,
                "weight": "bold"
              },
              "alignment": {
                "horizontal": "center",
                "vertical": "top"
              }
            },
            "start": 1,
            "length": 7,
            "offset": {
              "y": 0.1
            },
            "transition": {
              "in": "fade",
              "out": "fade"
            },
            "effect": "slideDown"
          },
          {
            "asset": {
              "type": "text",
              "text": "$199.99 • Free Shipping",
              "font": {
                "family": "Montserrat",
                "color": "#4CAF50",
                "size": 36
              },
              "alignment": {
                "horizontal": "center",
                "vertical": "bottom"
              }
            },
            "start": 2,
            "length": 6,
            "offset": {
              "y": -0.1
            },
            "transition": {
              "in": "fade",
              "out": "fade"
            }
          }
        ]
      },
      {
        "clips": [
          {
            "asset": {
              "type": "audio",
              "src": "https://example.com/upbeat-music.mp3",
              "volume": 0.3
            },
            "start": 0,
            "length": 8
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "resolution": "1080",
    "fps": 30,
    "quality": "high"
  }
}`;

  const socialMediaExample = `{
  "timeline": {
    "background": "#FF0050",
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "image",
              "src": "https://example.com/background.jpg"
            },
            "start": 0,
            "length": 6,
            "fit": "cover",
            "opacity": 0.7
          }
        ]
      },
      {
        "clips": [
          {
            "asset": {
              "type": "text",
              "text": "New Product Launch",
              "font": {
                "family": "Impact",
                "color": "#ffffff",
                "size": 72,
                "weight": "bold"
              },
              "alignment": {
                "horizontal": "center",
                "vertical": "center"
              }
            },
            "start": 0.5,
            "length": 2,
            "effect": "zoomIn",
            "transition": {
              "in": "zoom",
              "out": "fade"
            }
          },
          {
            "asset": {
              "type": "text",
              "text": "Coming Soon",
              "font": {
                "family": "Impact",
                "color": "#FFD700",
                "size": 48
              },
              "alignment": {
                "horizontal": "center",
                "vertical": "center"
              }
            },
            "start": 3,
            "length": 3,
            "effect": "slideLeft",
            "transition": {
              "in": "slideLeft",
              "out": "fade"
            }
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "size": {
      "width": 1080,
      "height": 1920
    },
    "fps": 30,
    "quality": "high"
  }
}`;

  const educationalExample = `{
  "timeline": {
    "background": "#1E3A8A",
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "video",
              "src": "https://example.com/lesson-intro.mp4"
            },
            "start": 0,
            "length": 5
          }
        ]
      },
      {
        "clips": [
          {
            "asset": {
              "type": "text",
              "text": "Lesson 1: Introduction",
              "font": {
                "family": "Roboto",
                "color": "#ffffff",
                "size": 48,
                "weight": "bold"
              },
              "alignment": {
                "horizontal": "left",
                "vertical": "top"
              },
              "width": 800
            },
            "start": 0,
            "length": 3,
            "offset": {
              "x": -0.3,
              "y": 0.3
            },
            "transition": {
              "in": "fade"
            }
          },
          {
            "asset": {
              "type": "text",
              "text": "Key Points:\\n• Topic Overview\\n• Learning Objectives\\n• Prerequisites",
              "font": {
                "family": "Roboto",
                "color": "#ffffff",
                "size": 28
              },
              "alignment": {
                "horizontal": "left",
                "vertical": "center"
              },
              "width": 700
            },
            "start": 1.5,
            "length": 3.5,
            "offset": {
              "x": -0.25,
              "y": 0
            },
            "transition": {
              "in": "slideRight",
              "out": "fade"
            }
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "resolution": "hd",
    "fps": 24
  }
}`;

  const testimonialExample = `{
  "timeline": {
    "background": "#ffffff",
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "image",
              "src": "https://example.com/customer-photo.jpg"
            },
            "start": 0,
            "length": 8,
            "fit": "contain",
            "scale": 0.4,
            "position": "left"
          }
        ]
      },
      {
        "clips": [
          {
            "asset": {
              "type": "text",
              "text": "\\"This product changed my life!\\"",
              "font": {
                "family": "Georgia",
                "color": "#333333",
                "size": 42,
                "weight": "bold"
              },
              "alignment": {
                "horizontal": "right",
                "vertical": "center"
              },
              "width": 600
            },
            "start": 1,
            "length": 6,
            "offset": {
              "x": 0.2,
              "y": 0.1
            },
            "transition": {
              "in": "fade",
              "out": "fade"
            }
          },
          {
            "asset": {
              "type": "text",
              "text": "- Sarah Johnson, Verified Customer",
              "font": {
                "family": "Georgia",
                "color": "#666666",
                "size": 24
              },
              "alignment": {
                "horizontal": "right",
                "vertical": "center"
              },
              "width": 600
            },
            "start": 2,
            "length": 5,
            "offset": {
              "x": 0.2,
              "y": -0.1
            },
            "transition": {
              "in": "fade",
              "out": "fade"
            }
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "size": {
      "width": 1280,
      "height": 720
    },
    "fps": 25,
    "quality": "high"
  }
}`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">Practical Examples</h2>
        <p className="text-white opacity-80 text-lg mb-6">
          Real-world examples to help you get started quickly with common use cases.
        </p>
      </div>

      {/* Product Video */}
      <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
        <div className="flex items-center space-x-3 mb-4">
          <ShoppingCart className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">E-commerce Product Video</h3>
        </div>
        <p className="text-white opacity-80 mb-4">
          Create an engaging product showcase video for your online store. This example combines
          product footage with text overlays for pricing and a background music track.
        </p>

        <div className="mb-4">
          <h4 className="text-white font-medium mb-2">Use Case:</h4>
          <ul className="list-disc list-inside text-white opacity-70 text-sm space-y-1">
            <li>Product pages on e-commerce websites</li>
            <li>Social media product announcements</li>
            <li>Email marketing campaigns</li>
            <li>Product catalog videos</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="text-white font-medium mb-2">Features Used:</h4>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white text-black px-2 py-1 text-xs">Video Asset</span>
            <span className="bg-white text-black px-2 py-1 text-xs">Text Overlays</span>
            <span className="bg-white text-black px-2 py-1 text-xs">Background Music</span>
            <span className="bg-white text-black px-2 py-1 text-xs">Transitions</span>
            <span className="bg-white text-black px-2 py-1 text-xs">Effects</span>
          </div>
        </div>

        <CodeBlock
          code={productVideoExample}
          language="json"
          title="Product Video Configuration"
        />

        <div className="mt-4 p-4 border border-green-500" style={{ backgroundColor: '#131313' }}>
          <h4 className="text-green-400 font-medium mb-2">Expected Cost</h4>
          <p className="text-white opacity-70 text-sm">
            8-second video at $0.15/sec = <span className="text-white font-bold">~12 credits</span>
          </p>
        </div>
      </div>

      {/* Social Media */}
      <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">Instagram Story / TikTok Video</h3>
        </div>
        <p className="text-white opacity-80 mb-4">
          Create eye-catching vertical videos optimized for Instagram Stories, TikTok, and
          other mobile-first platforms with bold text animations.
        </p>

        <div className="mb-4">
          <h4 className="text-white font-medium mb-2">Use Case:</h4>
          <ul className="list-disc list-inside text-white opacity-70 text-sm space-y-1">
            <li>Instagram Stories announcements</li>
            <li>TikTok promotional content</li>
            <li>Snapchat ads</li>
            <li>Mobile-first marketing campaigns</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="text-white font-medium mb-2">Features Used:</h4>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white text-black px-2 py-1 text-xs">Vertical Format (9:16)</span>
            <span className="bg-white text-black px-2 py-1 text-xs">Image Background</span>
            <span className="bg-white text-black px-2 py-1 text-xs">Text Animations</span>
            <span className="bg-white text-black px-2 py-1 text-xs">Custom Colors</span>
          </div>
        </div>

        <CodeBlock
          code={socialMediaExample}
          language="json"
          title="Social Media Video Configuration"
        />

        <div className="mt-4 p-4 border border-green-500" style={{ backgroundColor: '#131313' }}>
          <h4 className="text-green-400 font-medium mb-2">Expected Cost</h4>
          <p className="text-white opacity-70 text-sm">
            6-second video at $0.15/sec = <span className="text-white font-bold">~9 credits</span>
          </p>
        </div>
      </div>

      {/* Educational */}
      <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
        <div className="flex items-center space-x-3 mb-4">
          <GraduationCap className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">Educational Tutorial Video</h3>
        </div>
        <p className="text-white opacity-80 mb-4">
          Create professional lesson videos with structured content, bullet points,
          and clear typography perfect for e-learning platforms.
        </p>

        <div className="mb-4">
          <h4 className="text-white font-medium mb-2">Use Case:</h4>
          <ul className="list-disc list-inside text-white opacity-70 text-sm space-y-1">
            <li>Online course content</li>
            <li>Training materials</li>
            <li>Tutorial series</li>
            <li>Educational YouTube videos</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="text-white font-medium mb-2">Features Used:</h4>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white text-black px-2 py-1 text-xs">Video Background</span>
            <span className="bg-white text-black px-2 py-1 text-xs">Structured Text</span>
            <span className="bg-white text-black px-2 py-1 text-xs">Multi-line Formatting</span>
            <span className="bg-white text-black px-2 py-1 text-xs">Custom Positioning</span>
          </div>
        </div>

        <CodeBlock
          code={educationalExample}
          language="json"
          title="Educational Video Configuration"
        />

        <div className="mt-4 p-4 border border-green-500" style={{ backgroundColor: '#131313' }}>
          <h4 className="text-green-400 font-medium mb-2">Expected Cost</h4>
          <p className="text-white opacity-70 text-sm">
            5-second video at $0.15/sec = <span className="text-white font-bold">~7.5 credits</span>
          </p>
        </div>
      </div>

      {/* Testimonial */}
      <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
        <div className="flex items-center space-x-3 mb-4">
          <MessageSquare className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">Customer Testimonial Video</h3>
        </div>
        <p className="text-white opacity-80 mb-4">
          Showcase customer reviews and testimonials with professional layouts combining
          customer photos and quotes.
        </p>

        <div className="mb-4">
          <h4 className="text-white font-medium mb-2">Use Case:</h4>
          <ul className="list-disc list-inside text-white opacity-70 text-sm space-y-1">
            <li>Customer testimonial compilations</li>
            <li>Review showcase videos</li>
            <li>Social proof content</li>
            <li>Landing page videos</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="text-white font-medium mb-2">Features Used:</h4>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white text-black px-2 py-1 text-xs">Image Positioning</span>
            <span className="bg-white text-black px-2 py-1 text-xs">Quote Formatting</span>
            <span className="bg-white text-black px-2 py-1 text-xs">Custom Fonts</span>
            <span className="bg-white text-black px-2 py-1 text-xs">Layout Control</span>
          </div>
        </div>

        <CodeBlock
          code={testimonialExample}
          language="json"
          title="Testimonial Video Configuration"
        />

        <div className="mt-4 p-4 border border-green-500" style={{ backgroundColor: '#131313' }}>
          <h4 className="text-green-400 font-medium mb-2">Expected Cost</h4>
          <p className="text-white opacity-70 text-sm">
            8-second video at $0.15/sec = <span className="text-white font-bold">~12 credits</span>
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
        <h3 className="text-xl font-bold text-white mb-4">💡 Pro Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-white opacity-80">
              <span className="font-medium">Test with lower quality first:</span> Use "quality": "medium" during development to save credits
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-white opacity-80">
              <span className="font-medium">Optimize asset sizes:</span> Compress images and videos before using them to speed up rendering
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-white opacity-80">
              <span className="font-medium">Use webhooks:</span> Set up a callback URL to get notified when rendering is complete
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-white opacity-80">
              <span className="font-medium">Reuse renders:</span> Store rendered video URLs for future use instead of re-rendering
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-white opacity-80">
              <span className="font-medium">Check status regularly:</span> Poll the status endpoint every 2-3 seconds for real-time updates
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
        <h3 className="text-xl font-bold text-white mb-4">🚀 Next Steps</h3>
        <div className="space-y-3">
          <a href="#api-reference" className="block p-3 border border-white hover:bg-white hover:text-black transition-all">
            <h4 className="font-medium mb-1">Explore Full API Reference →</h4>
            <p className="text-sm opacity-70">Complete documentation of all parameters and options</p>
          </a>
          <a href="#advanced" className="block p-3 border border-white hover:bg-white hover:text-black transition-all">
            <h4 className="font-medium mb-1">Advanced Features →</h4>
            <p className="text-sm opacity-70">Webhooks, merge fields, and complex animations</p>
          </a>
        </div>
      </div>
    </div>
  );
}
