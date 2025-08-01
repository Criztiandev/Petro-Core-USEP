"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const XLSX = __importStar(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Function to check Excel file content
async function checkExcelContent() {
    try {
        const logOutput = [];
        const log = (message) => {
            console.log(message);
            logOutput.push(message);
        };
        log('Checking Excel file content...');
        // Path to the Excel file
        const excelPath = path_1.default.join(__dirname, '../../src/excel/DK_MINERALS_DATABASE.xlsx');
        if (!fs_1.default.existsSync(excelPath)) {
            log('Excel file not found at: ' + excelPath);
            process.exit(1);
        }
        log('Excel file found at: ' + excelPath);
        // Read the Excel file
        const workbook = XLSX.read(fs_1.default.readFileSync(excelPath), { type: 'buffer' });
        // Output sheet names
        log('\nSheet Names:');
        log(workbook.SheetNames.join(', '));
        // Count entries in each sheet
        log('\nEntries per sheet:');
        let totalMinerals = 0;
        const unrecognizedColumns = new Set();
        const validSheets = [];
        const emptySheets = [];
        workbook.SheetNames.forEach(sheetName => {
            // Skip hidden or special sheets
            if (sheetName.startsWith('_') || sheetName === 'Sheet1') {
                log(`${sheetName}: (skipped)`);
                return;
            }
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            totalMinerals += jsonData.length;
            if (jsonData.length === 0) {
                emptySheets.push(sheetName);
                log(`${sheetName}: 0 entries (EMPTY SHEET)`);
                return;
            }
            validSheets.push(sheetName);
            log(`${sheetName}: ${jsonData.length} entries`);
            // Print first entry from each sheet as example
            if (jsonData.length > 0) {
                // Check for column names
                const firstItem = jsonData[0];
                log(`  Example keys: ${Object.keys(firstItem).join(', ')}`);
                // Check for standard keys
                const standardKeys = [
                    'Mineral Code', 'Mineral Name', 'Chemical Formula', 'Mineral Group',
                    'Color', 'Streak', 'Luster', 'Hardness', 'Cleavage', 'Fracture',
                    'Habit', 'Crystal System'
                ];
                // Check for alternative column names
                const alternativeKeys = {
                    'Mineral': 'Mineral Name',
                    'Chemical Formula ': 'Chemical Formula',
                    'Group': 'Mineral Group'
                };
                // Check for missing standard keys
                const missingKeys = [];
                standardKeys.forEach(key => {
                    if (!firstItem.hasOwnProperty(key) &&
                        !Object.keys(alternativeKeys).some(alt => firstItem.hasOwnProperty(alt) && alternativeKeys[alt] === key)) {
                        missingKeys.push(key);
                    }
                });
                if (missingKeys.length > 0) {
                    log(`  ⚠️ Missing expected columns: ${missingKeys.join(', ')}`);
                }
                // Identify any non-standard columns
                Object.keys(firstItem).forEach(key => {
                    if (!standardKeys.includes(key) && !Object.keys(alternativeKeys).includes(key)) {
                        unrecognizedColumns.add(key);
                    }
                });
            }
        });
        log('\n===== SUMMARY =====');
        log(`Total sheets: ${workbook.SheetNames.length}`);
        log(`Valid mineral sheets: ${validSheets.length}`);
        log(`Empty sheets: ${emptySheets.length} (${emptySheets.join(', ')})`);
        log(`Total minerals found: ${totalMinerals}`);
        if (unrecognizedColumns.size > 0) {
            log('\nUnrecognized column names found:');
            log(Array.from(unrecognizedColumns).join(', '));
            log('These might need special handling during import.');
        }
        log('\nCheck completed successfully!');
        // Write output to file
        const outputPath = path_1.default.join(__dirname, '../../excel-check-results.txt');
        fs_1.default.writeFileSync(outputPath, logOutput.join('\n'));
        console.log(`\nResults written to ${outputPath}`);
        process.exit(0);
    }
    catch (error) {
        console.error('Error checking Excel file:', error);
        process.exit(1);
    }
}
// Run the function
checkExcelContent();
