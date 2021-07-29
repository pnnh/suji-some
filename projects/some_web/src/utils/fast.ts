import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents } from "@fluentui/web-components";

import "@/components/components";
import "@/views/views";

DesignSystem.getOrCreate().register(
    Object.values(allComponents).map(definition => definition())
);
