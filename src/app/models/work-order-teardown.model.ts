export class TearDown {
    workOrderTeardownId;
    workOrderId;
    workFlowWorkOrderId;
    masterCompanyId;
    createdBy;
    updatedBy;
    createdDate;
    updatedDate;
    isActive;
    isDeleted;
    workOrderRemovalReasons;
    workOrderPmaDerBulletins;
    workOrderPreliinaryReview;
    workOrderPreAssmentResults;
    workOrderDiscovery;
    workOrderPreAssemblyInspection;
    workOrderWorkPerformed;
    workOrderTestDataUsed;
    workOrderBulletinsModification;
    workOrderFinalTest;
    workOrderFinalInspection;
    workOrderAdditionalComments;
    isAdditionalComments;
    isBulletinsModification;
    isDiscovery;
    isFinalInspection;
    isFinalTest;
    isPmaDerBulletins;
    isPreAssemblyInspection;
    isPreAssmentResults;
    isPreliinaryReview;
    isRemovalReasons;
    isTestDataUsed;
    isWorkPerformed;
    subWOPartNoId;
    subWorkOrderId;
    // WorkOrderPreliinaryReview.InspectorDate:Dateate;
    // TechnicianDate:Dateate;
     constructor() {
        this.workOrderTeardownId=0;
        this.workOrderId=0;
        this.workFlowWorkOrderId=0;
        this.masterCompanyId=1;
        this.createdBy=new Date();
        this.updatedBy =new Date();
        this.createdDate=new Date();
        this.updatedDate=new Date();
        this.isActive =true;
        this.isDeleted=false;
        this.isAdditionalComments=false;
        this.isBulletinsModification=false;
        this.isDiscovery=false;
        this.isFinalInspection=false;
        this.isFinalTest=false;
        this.isPmaDerBulletins=false;
        this.isPreAssemblyInspection=false;
        this.isPreAssmentResults=false;
        this.isPreliinaryReview=false;
        this.isRemovalReasons=false;
        this.isTestDataUsed=false;
        this.isWorkPerformed=false;
        this.workOrderRemovalReasons={
                workOrderRemovalReasonsId:0,
                workOrderTeardownId:0,
                reasonId:0,
                memo:''
                }; 
                this.workOrderPmaDerBulletins={
                    workOrderPmaDerBulletinsId:0,
                    workOrderTeardownId:0,
                    airworthinessDirecetives:'',
                    mandatoryService:'',
                    requestedService:'',
                    serviceLetters:'',
                    pmaParts:'',
                    derRepairs:''
                    };
                    this.workOrderPreliinaryReview={
                    workOrderPreliinaryReviewId:0,
                    workOrderTeardownId:0,
                     memo:'',

                    reasonId:0,
                    inspectorId:0,
                    inspectorDate:new Date()            };
             this.workOrderPreAssmentResults={
                workOrderPreAssmentResultsId:0,
                workOrderTeardownId:0,
                reasonId:0,
                 memo:'',
                technicianId:0,
                technicianDate:new Date(),
                inspectorId:0,
                inspectorDate:new Date()
                };
                this.workOrderDiscovery={
                    workOrderDiscoveryId:0,
                    workOrderTeardownId:0,

                    reasonId:0,
                     memo:'',
                    technicianId:0,
                    technicianDate:new Date(),
                    inspectorId:0,
                    inspectorDate:new Date()
                    };
                    this.workOrderPreAssemblyInspection={
                        workOrderPreAssemblyInspectionId:0,
                         workOrderTeardownId:0,
                         memo:'',
                         reasonId:0,
                        technicianId:0,
                        technicianDate:new Date(),
                        inspectorId:0,
                        inspectorDate:new Date()
                        };
                        this.workOrderWorkPerformed={
                            workOrderWorkPerformedId:0,
                            workOrderTeardownId:0,
                            reasonId:0,
                             memo:'',
                            technicianId:0,
                            technicianDate:new Date(),
                            inspectorId:0,
                            inspectorDate:new Date()
                            };
                            this.workOrderTestDataUsed={
                                workOrderTestDataUsedId:0,
                                workOrderTeardownId:0,
                                reasonId:0,
                                 memo:''
                                };
                                this.workOrderBulletinsModification={
                                    workOrderBulletinsModificationId:0,
                                    workOrderTeardownId:0,
                                    reasonId:0,
                                     memo:''
                                    };
                                    this.workOrderFinalTest={
                                        workOrderFinalTestId:0,
                                         workOrderTeardownId:0,
                                        //  ManualEntry:false,
                                        reasonId:0,
                                         memo:'',
                                        technicianId:0,
                                        technicianDate:new Date(),
                                        inspectorId:0,
                                        inspectorDate:new Date()
                                        };
                                        this.workOrderFinalInspection={
                                            workOrderFinalInspectionId:0,
                                            workOrderTeardownId:0,
                                            reasonId:0,
                        
                                             memo:'',
                                            inspectorId:0,
                                            inspectorDate:new Date()
                                            };
                                            this.workOrderAdditionalComments={
            workOrderAdditionalCommentsId:0,
            workOrderTeardownId:0,
            reasonId:0,
             memo:''
            }        
        }
    }