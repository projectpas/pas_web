export class GLAccountNodeSetup {
    glAccountNodeId: number;
    ledgerName: string;
    nodeCode: string;
    nodeName: string;
    parentNodeId: number;
    parentNodeName: string;
    leafNodeCheck: boolean;
    GLAccountNodeType: string;
    fsType: boolean;
    description: string;
    createdBy: string;
    updatedBy: string;
    createdDate: Date;
    updatedDate: Date;
    isActive: boolean;
    isDelete: boolean;
    ledgerNameMgmStructureId: number;
    comapnycodes: string;
    selectedCompanysData: any[] = [];

    parentNode: GLAccountNodeSetup;

    //the below property are related to client side code and has nothing to do with the actual entity
    nodeSetupList: GLAccountNodeSetup[];
}