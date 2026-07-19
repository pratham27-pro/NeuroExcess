import type { FeatureController } from "~features/types"
import type { SkipLinksSettings } from "~lib/settings/schema"

import { analyzePage } from "./analyzePage"
import { injectSkipLinks, isSkipLinksInjected, removeSkipLinks } from "./skipLinksDom"

export const skipLinksController: FeatureController<SkipLinksSettings> = {
  apply(_settings) {
    injectSkipLinks(analyzePage())
  },
  remove() {
    removeSkipLinks()
  },
  isApplied() {
    return isSkipLinksInjected()
  }
}
