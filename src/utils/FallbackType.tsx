import {FunctionalComponent, h} from "@stencil/core";
import {GenericIdentifierType} from "./GenericIdentifierType";

export class FallbackType extends GenericIdentifierType {
    hasCorrectFormat(): boolean {
        return true;
    }

    init(): Promise<void> {
        return;
    }

    isResolvable(): boolean {
        return false;
    }

    renderPreview(): FunctionalComponent<any> {
        return (
            <span>{this.value}</span>
        )
    }

    getSettingsKey(): string {
        return "";
    }
}
